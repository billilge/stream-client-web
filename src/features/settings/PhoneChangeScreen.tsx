import {
  ActionArea,
  ActionAreaButton,
  TextField,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  PHONE_CHANGE_TOASTS,
  type PhoneChangeToast,
} from "@/features/settings/constants/settings";
import {
  formatPhoneNumber,
  isValidPhoneNumber,
  PHONE_NUMBER_MAX_LENGTH,
  toPhoneDigits,
} from "@/lib/phone";
import { isApiError } from "@/shared/api";
import {
  MEMBERS_ERROR_CODES,
  useUpdatePhoneNumberMutation,
} from "@/shared/entities/members/membersQueries";

// Figma: 전화번호 변경 (nodeId 3524:152450), 입력 중 (3524:152465), 완료 토스트 (3524:152457).
// 입력칸은 Figma `Textinput/Textfield`(445:8591, WDS 공식 문서 링크 확인)라 WDS `TextField`를
// 그대로 쓴다. 다만 WDS `TextField`는 입력 박스만 그려서, 위 라벨("새 전화번호")과 아래 안내
// 문구는 Figma 구조대로 형제 요소로 따로 그린다 — WDS `Label`은 required `*` 처리만 더해주는
// Typography 래퍼라 여기선 쓸 이유가 없다(wds-component-usage.md의 행사 신청 폼 선례와 같다).
//
// "변경하기" 버튼은 번호를 형식에 맞게 다 입력했을 때만 활성화된다(Figma 비활성 #F4F4F5 /
// 활성 #0066FF). 높이 56px은 ActionAreaButton 기본(48px)과 달라 sx로 세로 padding만 보정한다.
//
// 누르면 서버에 번호를 바꾸고 결과 토스트를 띄운다. 성공해도 이 화면에 남는다 — Figma 완료 토스트
// 프레임이 입력값을 그대로 둔 채 버튼만 비활성으로 그려서, 방금 바꾼 번호 그대로면 버튼을 다시 막는다.
// 다른 회원이 쓰는 번호(409)는 따로 안내하고, 그 밖의 실패는 다시 시도하라고만 한다.
//
// 하이픈 포맷과 유효성 판정은 온보딩 연락처 입력(#110)과 같은 로직이라 `lib/phone.ts`에 있다.
//
function PhoneChangeScreen() {
  const navigate = useNavigate();
  const { mutate: updatePhoneNumber, isPending } =
    useUpdatePhoneNumberMutation();
  const [phone, setPhone] = useState("");
  // 마지막으로 변경에 성공한 번호 — 입력값이 이것과 같으면 버튼을 막는다
  const [savedPhone, setSavedPhone] = useState<string | null>(null);
  // 닫힌 뒤에도 마지막 토스트를 들고 있어서, 닫히는 동안 문구·색이 바뀌지 않는다
  const [toast, setToast] = useState<PhoneChangeToast>(
    PHONE_CHANGE_TOASTS.changed,
  );
  const [toastOpen, setToastOpen] = useState(false);
  // 토스트가 떠 있는 중에 다시 저장해도 스크린리더가 재안내하도록 매번 새로 마운트한다
  // (EventsApplicationScreen·BillilgeReturnSection과 같은 패턴).
  const [toastToken, setToastToken] = useState(0);

  const canSave = isValidPhoneNumber(phone) && phone !== savedPhone;

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="전화번호 변경"
      variant="normal"
    />,
  );

  const showToast = (next: PhoneChangeToast) => {
    setToast(next);
    setToastOpen(true);
    setToastToken((token) => token + 1);
  };

  const handleSave = () => {
    updatePhoneNumber(
      { phoneNumber: toPhoneDigits(phone) },
      {
        onSuccess: () => {
          setSavedPhone(phone);
          showToast(PHONE_CHANGE_TOASTS.changed);
        },
        onError: (error) => {
          if (
            isApiError(error) &&
            error.code === MEMBERS_ERROR_CODES.phoneNumberAlreadyExists
          ) {
            showToast(PHONE_CHANGE_TOASTS.alreadyExists);
            return;
          }
          console.error(error);
          showToast(PHONE_CHANGE_TOASTS.failed);
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-2 px-5 pt-2">
        <Typography
          as="label"
          color="semantic.label.neutral"
          htmlFor="phone"
          variant="label1"
          weight="bold"
        >
          새 전화번호
        </Typography>
        <TextField
          id="phone"
          inputMode="tel"
          maxLength={PHONE_NUMBER_MAX_LENGTH}
          onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
          placeholder="010-1234-5678"
          type="tel"
          value={phone}
        />
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          행사 신청 시 사용돼요.
        </Typography>
      </div>

      <div className="shrink-0">
        <ActionArea>
          {/* Figma Main Action은 56px인데 ActionAreaButton(size="large")은 48px이라 세로 padding만 보정 */}
          <ActionAreaButton
            disabled={!canSave}
            loading={isPending}
            onClick={handleSave}
            sx={{ paddingBlock: "16px" }}
          >
            변경하기
          </ActionAreaButton>
        </ActionArea>
        {/* Figma Action Area(110px)의 버튼 아래 34px 중 WDS가 주는 padding 20px을 뺀 14px을 더한다
            (EventsApplicationScreen과 같은 보정) */}
        <div className="h-safe-bottom-extra bg-background-elevated-normal sm:h-[14px]" />
      </div>

      <ScreenToast
        key={toastToken}
        message={toast.message}
        onOpenChange={setToastOpen}
        open={toastOpen}
        variant={toast.variant}
      />
    </div>
  );
}

export default PhoneChangeScreen;
