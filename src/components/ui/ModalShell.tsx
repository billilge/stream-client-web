import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

// 모달 안에서 Tab이 돌 수 있는 요소들 — 포커스를 가둘 때 첫/마지막을 찾는 데 쓴다
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalShellProps {
  open: boolean;
  /** Esc·딤 클릭으로 닫을 때 */
  onClose: () => void;
  /** 모달 제목 요소의 id — 스크린리더가 이 제목을 모달 이름으로 읽는다 */
  labelledBy: string;
  /** 카드 안쪽 여백·간격·정렬. Figma 모달마다 다르다 (예: 확인 모달 `items-center gap-6 px-5 pt-6 pb-5`) */
  className: string;
  children: ReactNode;
}

// 모달의 바깥 틀 — 화면 포털, 검정 70% 딤, 311px·radius 24px 흰 카드, 포커스 이동·복원, Esc 닫기, Tab 순환.
// 본문과 버튼은 쓰는 쪽이 채운다. 제목+설명 모달은 ConfirmModal을 쓰고, 본문이 다른 모달
// (빌릴게 대여 확인 등)만 이 틀에 직접 본문을 넣는다.
// WDS `Modal`(popup)은 너비 360px 고정·모서리 12px이라 Figma(311px·24px)와 달라서, BottomSheet와 같은
// 방식으로 화면 포털에 직접 그린다.
function ModalShell({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: ModalShellProps) {
  const portalEl = useScreenSheetPortal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // 열리면 포커스를 모달 안으로 옮기고, 닫히면 열기 전에 있던 자리로 되돌린다.
  // aria-modal만으로는 뒤 화면이 비활성이 되지 않아서 키보드로 폼까지 닿을 수 있다.
  useEffect(() => {
    if (!open) {
      return;
    }
    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialogRef.current?.focus();

    return () => lastFocusedRef.current?.focus();
  }, [open]);

  // Esc로 닫고, Tab은 모달 안에서만 순환시킨다
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    const focusables = [
      ...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ];
    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    // 마지막에서 Tab, 첫 번째(또는 카드 자체)에서 Shift+Tab이면 반대편으로 직접 보낸다
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    }
  };

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      // 닫혀 있어도 사라지는 애니메이션 때문에 DOM에는 남는다 — inert로 보조기기·키보드 양쪽에서 제외한다
      inert={!open}
      onKeyDown={handleKeyDown}
      className={`absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* 딤은 Figma "딤드"(nodeId 1133:43406) 그대로 검정 70% */}
      {/* 딤 클릭으로도 닫히지만 Tab 순서에서는 뺀다 — 키보드는 취소 버튼과 Esc로 닫는다 */}
      <button
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`absolute top-1/2 left-1/2 flex w-[311px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl bg-background-normal ${className}`}
        ref={dialogRef}
        role="dialog"
        // 모달이 열릴 때 포커스를 받을 대상 — 버튼을 바로 잡으면 실수로 눌릴 수 있어 카드에 준다
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    portalEl,
  );
}

export default ModalShell;
