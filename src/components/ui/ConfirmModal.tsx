import { Button, Typography } from "@wanteddev/wds";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface ConfirmModalProps {
  open: boolean;
  /** 제목 앞에 붙는 강조 부분(파란색). 예: 행사명 */
  highlight?: string;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma: Modal (nodeId 995:34701 — 신청 확인 모달 1133:43407에서 사용). Stream 로컬 컴포넌트다.
// WDS `Modal`(popup)은 너비 360px 고정·모서리 12px·버튼 높이가 Figma(311px·24px·46px)와 달라서
// 내부를 여러 군데 덮어써야 한다 — 대신 BottomSheet와 같은 방식으로 화면 포털에 직접 그린다.
// 버튼만 WDS `Button`이다: solid×assistive가 Figma의 Fill/Normal 배경 + Label/Neutral 글자,
// solid×primary가 파란 배경 + 흰 글자와 같고, size="medium"이 radius 10px·body2(15px)까지 일치한다.
// 세로 padding만 9px → 12px로 보정한다(Figma 버튼 높이 46px).
function ConfirmModal({
  open,
  highlight,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      className={`absolute inset-0 transition-opacity duration-200 ease-out ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        type="button"
      />
      <div
        aria-modal="true"
        className="absolute top-1/2 left-1/2 flex w-[311px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 rounded-3xl bg-background-normal px-5 pt-6 pb-5"
        role="dialog"
      >
        {/* opacity-80은 Figma Message 프레임에 걸려 있는 값을 그대로 옮긴 것이다 */}
        <div className="flex w-full flex-col gap-1 text-center opacity-80">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="heading2"
            weight="bold"
          >
            {/* 강조 부분만 파란색 — 색을 섞는 규칙을 화면이 아니라 여기서 갖는다 */}
            {highlight && (
              <Typography
                as="span"
                color="semantic.primary.normal"
                variant="heading2"
                weight="bold"
              >
                {highlight}{" "}
              </Typography>
            )}
            {title}
          </Typography>
          {description && (
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label1-reading"
              weight="regular"
            >
              {description}
            </Typography>
          )}
        </div>
        <div className="flex w-full gap-2">
          <Button
            color="assistive"
            fullWidth
            onClick={onCancel}
            size="medium"
            sx={{ paddingBlock: "12px" }}
            variant="solid"
          >
            {cancelLabel}
          </Button>
          <Button
            color="primary"
            fullWidth
            onClick={onConfirm}
            size="medium"
            sx={{ paddingBlock: "12px" }}
            variant="solid"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    portalEl,
  );
}

export default ConfirmModal;
