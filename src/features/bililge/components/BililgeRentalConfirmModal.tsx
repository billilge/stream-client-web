import { Button, Divider, Typography } from "@wanteddev/wds";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface BililgeRentalConfirmModalProps {
  open: boolean;
  itemName: string;
  quantity: number;
  timeLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma: 빌릴게 대여 확인 모달의 modal(nodeId 1133:49951) — 반납 신청 확인 모달
// (BililgeReturnConfirmModal)과 같은 컨테이너 패턴(포털·딤드·rounded-3xl·접근성)을 그대로 쓰되,
// 이 모달은 타이틀이 가운데 정렬이 아니라 왼쪽 정렬이고, 설명 문구 대신 물품/수량/대여 시작
// 시간을 보여주는 상세 박스가 있다. 취소 버튼도 "닫기"가 아니라 "수정"이다 — 모달만 닫고
// 바텀시트로 돌아가 값을 바꿀 수 있게 하는 동작이라 onCancel이 시트를 닫지 않는다.
function BililgeRentalConfirmModal({
  open,
  itemName,
  quantity,
  timeLabel,
  onCancel,
  onConfirm,
}: BililgeRentalConfirmModalProps) {
  const portalEl = useScreenSheetPortal();
  const titleId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 열릴 때: 이전 포커스를 기억해두고 기본 액션(신청하기)으로 포커스를 옮긴다. StrictMode에서
  // 이 이펙트가 두 번 실행되면 두 번째 실행 시점엔 activeElement가 이미 신청하기 버튼(직전에
  // 우리가 옮긴 포커스)이라, 그대로 덮어쓰면 원래 포커스를 영영 잃는다 — 이미 우리 버튼에 가
  // 있으면 갱신하지 않는다.
  // 닫힐 때: 모달을 열었던 요소로 포커스를 되돌린다.
  useEffect(() => {
    if (open) {
      const active = document.activeElement as HTMLElement | null;
      if (
        active !== confirmButtonRef.current &&
        active !== cancelButtonRef.current
      ) {
        previousFocusRef.current = active;
      }
      confirmButtonRef.current?.focus();
      return;
    }
    previousFocusRef.current?.focus();
  }, [open]);

  // Esc로 닫기 + Tab이 두 버튼 밖으로 나가지 않도록 트랩(딤드 버튼은 tabIndex=-1이라 순환 대상 아님).
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const first = cancelButtonRef.current;
      const last = confirmButtonRef.current;
      if (!first || !last) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

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
      // 닫혀있을 때 포커스/접근성 트리에서 완전히 제외한다 — opacity·pointer-events만으로는
      // 탭 키가 숨겨진 버튼으로 계속 들어가는 문제를 못 막는다.
      inert={!open}
    >
      <button
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        // 폭은 컬럼 좌우에 32px씩 남긴 값 — 폰은 Figma 그대로 311px(375 기준),
        // 데스크톱 컬럼(sm 이상, 480px)에서는 416px.
        className="relative flex w-[311px] flex-col gap-5 rounded-3xl bg-background-normal p-5 sm:w-[416px]"
        role="dialog"
      >
        <div className="flex flex-col gap-3">
          <Typography
            as="p"
            color="semantic.label.normal"
            id={titleId}
            variant="headline1"
            weight="bold"
          >
            이 내용으로 대여를 신청할까요?
          </Typography>
          <div className="flex flex-col gap-3 rounded-xl bg-background-alternative p-4">
            <div className="flex items-center justify-between">
              <Typography
                color="semantic.label.neutral"
                variant="body2"
                weight="medium"
              >
                물품
              </Typography>
              <Typography
                color="semantic.label.normal"
                variant="body2"
                weight="bold"
              >
                {itemName}
              </Typography>
            </div>
            <Divider color="semantic.line.solid.neutral" />
            <div className="flex items-center justify-between">
              <Typography
                color="semantic.label.neutral"
                variant="body2"
                weight="medium"
              >
                수량
              </Typography>
              <Typography
                color="semantic.label.normal"
                variant="body2"
                weight="bold"
              >
                {`${quantity}개`}
              </Typography>
            </div>
            <Divider color="semantic.line.solid.neutral" />
            <div className="flex items-center justify-between">
              <Typography
                color="semantic.label.neutral"
                variant="body2"
                weight="medium"
              >
                대여 시작 시간
              </Typography>
              <Typography
                color="semantic.label.normal"
                variant="body2"
                weight="bold"
              >
                {timeLabel}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Button
            color="assistive"
            onClick={onCancel}
            ref={cancelButtonRef}
            size="medium"
            sx={{ flex: 1, padding: "12px 20px" }}
            variant="solid"
          >
            수정
          </Button>
          <Button
            color="primary"
            onClick={onConfirm}
            ref={confirmButtonRef}
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

export default BililgeRentalConfirmModal;
