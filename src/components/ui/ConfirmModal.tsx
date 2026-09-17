import { Button, Typography } from "@wanteddev/wds";
import { IconCircleExclamationFill } from "@wanteddev/wds-icon";
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
  /**
   * negative: 되돌릴 수 없는 행동을 확인할 때(Figma Modal의 `Circle Exclamation=on` + `Style=Negative`).
   * 느낌표 아이콘이 붙고 확인 버튼이 빨강이 된다.
   */
  tone?: "default" | "negative";
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
  tone = "default",
}: ConfirmModalProps) {
  const isNegative = tone === "negative";
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      // 닫혀 있어도 사라지는 애니메이션 때문에 DOM에는 남는다 — inert로 보조기기·키보드 양쪽에서 제외한다
      inert={!open}
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
        className={`absolute top-1/2 left-1/2 flex w-[311px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 rounded-3xl bg-background-normal ${
          // 아이콘이 붙는 경우 Figma 여백이 위 24px이 아니라 사방 20px이다
          isNegative ? "p-5" : "px-5 pt-6 pb-5"
        }`}
        role="dialog"
      >
        {/* 아이콘과 문구 사이는 12px — 카드 자체 간격(24px)과 달라서 한 번 더 감싼다 */}
        <div
          className={`flex w-full flex-col items-center ${isNegative ? "gap-3" : ""}`}
        >
          {isNegative && (
            <IconCircleExclamationFill className="size-[63px] text-fill-strong" />
          )}
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
            // WDS Button 색상은 primary/assistive뿐이라 위험 버튼은 배경색만 토큰으로 덮어쓴다
            sx={{
              backgroundColor: isNegative
                ? "var(--color-status-negative)"
                : undefined,
              paddingBlock: "12px",
            }}
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
