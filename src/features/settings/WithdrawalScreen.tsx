import {
  ActionArea,
  ActionAreaButton,
  Checkbox,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import WithdrawalNoticeCard from "@/features/settings/components/WithdrawalNoticeCard";
import { WITHDRAWAL_NOTICES } from "@/features/settings/constants/settings";

// Figma: 탈퇴 확인 페이지 (nodeId 3524:152473), 체크 상태 (3524:152489), 확인 모달 (3524:152517).
// 안내 문구 4장은 같은 컴포넌트의 인스턴스라 WithdrawalNoticeCard + WITHDRAWAL_NOTICES로 분리했다.
//
// 동의 체크박스를 켜야 "탈퇴하기"가 활성화되고(Figma 비활성 Interaction/Disable #F4F4F5 →
// 활성 Status/Negative #FF4242), 누르면 확인 모달이 뜬다. WDS Button은 color가
// primary/assistive뿐이라 빨간 버튼은 ConfirmModal과 같은 방식으로 sx로 배경을 덮는다.
//
// 모달에서 탈퇴를 확정하면 탈퇴 완료 페이지(3524:152505)로 넘어간다. 실제 탈퇴 API 호출은
// 연동할 때 onConfirm에 붙인다.
function WithdrawalScreen() {
  const navigate = useNavigate();
  const consentId = useId();
  const [agreed, setAgreed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Figma Withdrawal Content(3524:152476): 헤더 아래 12px, 제목과 목록 사이 16px */}
      <div className="scrollbar-hidden flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-3">
        <Typography
          as="h1"
          color="semantic.label.strong"
          variant="heading1"
          weight="bold"
        >
          탈퇴하기 전에 꼭
          <br />
          확인해 주세요
        </Typography>

        <ul className="flex flex-col gap-2">
          {WITHDRAWAL_NOTICES.map((notice) => (
            <WithdrawalNoticeCard
              description={notice.description}
              key={notice.id}
              title={notice.title}
            />
          ))}
        </ul>
      </div>

      <div className="shrink-0">
        <div className="flex items-start gap-2 px-5">
          <Checkbox
            checked={agreed}
            id={consentId}
            onCheckedChange={setAgreed}
            size="small"
          />
          <label className="flex-1" htmlFor={consentId}>
            <Typography
              as="span"
              color="semantic.label.normal"
              variant="label1"
              weight="regular"
            >
              위 내용을 모두 확인했으며 회원 탈퇴에 동의합니다.
            </Typography>
          </label>
        </div>

        <ActionArea>
          {/* Figma Main Action은 56px인데 ActionAreaButton(size="large")은 48px이라 세로 padding을
              보정하고, WDS Button엔 negative 색이 없어 배경만 status/negative로 덮는다. */}
          <ActionAreaButton
            disabled={!agreed}
            onClick={() => setConfirmOpen(true)}
            sx={
              agreed
                ? {
                    backgroundColor: "var(--color-status-negative)",
                    paddingBlock: "16px",
                  }
                : { paddingBlock: "16px" }
            }
          >
            탈퇴하기
          </ActionAreaButton>
        </ActionArea>
        {/* Figma Action Area(110px)의 버튼 아래 34px 중 WDS가 주는 padding 20px을 뺀 14px */}
        <div className="h-safe-bottom-extra bg-background-elevated-normal sm:h-[14px]" />
      </div>

      <ConfirmModal
        cancelLabel="취소"
        confirmLabel="탈퇴하기"
        description={
          "탈퇴하면 삭제된 회원 정보와\n이용 내역은 다시 복구할 수 없어요."
        }
        onCancel={() => setConfirmOpen(false)}
        // 탈퇴를 확정하면 되돌아올 화면이 아니라 완료 화면으로 치환한다
        onConfirm={() =>
          navigate("/settings/withdraw/complete", { replace: true })
        }
        open={confirmOpen}
        title="정말 탈퇴하시겠어요?"
        tone="negative"
      />
    </div>
  );
}

export default WithdrawalScreen;
