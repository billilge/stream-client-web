import { Button, Typography } from "@wanteddev/wds";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface BililgeReturnConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma: 빌릴게 반납 신청 확인 모달의 Modal(nodeId 1133:50014) — WDS `Alert`는 코드 컴포넌트로
// 존재하지만 컨테이너가 radius 12px·min-width 320px 고정이라, 이 모달(radius 24px·고정폭
// 311px·padding 24/20/20)과 안 맞아 오버라이드 범위가 너무 크다(자세한 판단 근거는
// wds-component-usage.md "반납 신청 확인 모달은 WDS Alert가 아니다" 참고). 버튼은 WDS
// `Button`(size="medium")이 radius(10px)·타이포(Body 2/Medium·Bold)까지 정확히 일치해서
// 재사용하고, 세로 패딩만(9px→12px) sx로 보정했다.
// BottomSheet와 같은 방식으로 ScreenLayout의 포털 슬롯에 그려서 375×812 프레임 전체를 덮는다.
function BililgeReturnConfirmModal({
  open,
  onCancel,
  onConfirm,
}: BililgeReturnConfirmModalProps) {
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
        type="button"
      />
      <div className="relative flex w-[311px] flex-col items-center gap-6 rounded-3xl bg-background-normal px-5 pt-6 pb-5">
        <div className="flex flex-col gap-1 text-center">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="heading2"
            weight="bold"
          >
            반납을 신청할까요?
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label1-reading"
          >
            승인 알림을 받은 후 학생회실에 반납해 주세요.
          </Typography>
        </div>
        <div className="flex w-full gap-2">
          <Button
            color="assistive"
            onClick={onCancel}
            size="medium"
            sx={{ flex: 1, padding: "12px 20px" }}
            variant="solid"
          >
            수정
          </Button>
          <Button
            color="primary"
            onClick={onConfirm}
            size="medium"
            sx={{ flex: 1, padding: "12px 20px" }}
            variant="solid"
          >
            신청하기
          </Button>
        </div>
      </div>
    </div>,
    portalEl,
  );
}

export default BililgeReturnConfirmModal;
