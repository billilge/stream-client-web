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

// Figma: 전화번호 변경 (nodeId 1799:87220), 입력 중 (1799:87227), 완료 토스트 (1917:93781).
// 입력칸은 Figma `Textinput/Textfield`(445:8591, WDS 공식 문서 링크 확인)라 WDS `TextField`를
// 그대로 쓴다. 다만 WDS `TextField`는 입력 박스만 그려서, 위 라벨("새 전화번호")과 아래 안내
// 문구는 Figma 구조대로 형제 요소로 따로 그린다 — WDS `Label`은 required `*` 처리만 더해주는
// Typography 래퍼라 여기선 쓸 이유가 없다(wds-component-usage.md의 행사 신청 폼 선례와 같다).
//
// "변경하기" 버튼은 번호를 형식에 맞게 다 입력했을 때만 활성화된다(Figma 비활성 #F4F4F5 /
// 활성 #0066FF). 높이 56px은 ActionAreaButton 기본(48px)과 달라 sx로 세로 padding만 보정한다.
// 실제 변경 API가 없어서 누르면 Figma처럼 완료 토스트만 띄운다.
//
// Figma 입력 중 상태(1799:87230)가 "010-1234-5"처럼 하이픈이 끼워진 모습이라 입력하는 대로
// 하이픈을 넣어준다. 유효 기준은 placeholder와 같은 010 + 8자리다.
const PHONE_PATTERN = /^010-\d{4}-\d{4}$/;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function PhoneChangeScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  // 토스트가 떠 있는 중에 다시 저장해도 스크린리더가 재안내하도록 매번 새로 마운트한다
  // (EventsApplicationScreen·BililgeReturnSection과 같은 패턴).
  const [toastToken, setToastToken] = useState(0);

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

  const handleSave = () => {
    setToastOpen(true);
    setToastToken((token) => token + 1);
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
          maxLength={13}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
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
            disabled={!PHONE_PATTERN.test(phone)}
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
        message="전화번호를 변경했어요."
        onOpenChange={setToastOpen}
        open={toastOpen}
        variant="positive"
      />
    </div>
  );
}

export default PhoneChangeScreen;
