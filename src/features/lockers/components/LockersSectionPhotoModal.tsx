import { IconButton, Typography } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import type { KeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface LockersSectionPhotoModalProps {
  open: boolean;
  sectionName: string;
  // 칸 번호가 이미 찍혀 있는 사진이다
  photoUrl: string;
  onClose: () => void;
}

// Figma: A-1구역 실제사진 Modal (nodeId 2159:110299) — Stream 로컬. 닫기 아이콘 + 구역 사진 +
// 안내 문구를 단 카드다. 칸 번호는 서버가 사진에 찍어서 준다. WDS `Modal`은 너비·모서리가 달라서 ConfirmModal과 같은 방식으로
// 화면 포털에 직접 그린다. 닫기만 WDS `IconButton` + `IconClose`(Figma "Name=close, Thick=False")다.
//
// Figma 카드는 top 229px에 있지만 화면 높이가 기기마다 달라서 세로 가운데에 둔다.
function LockersSectionPhotoModal({
  open,
  sectionName,
  photoUrl,
  onClose,
}: LockersSectionPhotoModalProps) {
  const portalEl = useScreenSheetPortal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // 열리면 포커스를 모달로 옮기고, 닫히면 사진 버튼으로 되돌린다
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

  // 포커스할 곳이 닫기 버튼뿐이라 Tab 가두기는 필요 없다 — Esc로 닫는 것만 받는다
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      // 닫혀 있어도 사라지는 애니메이션 때문에 DOM에는 남는다 — inert로 보조기기·키보드 양쪽에서 제외한다
      className={`absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      inert={!open}
      onKeyDown={handleKeyDown}
    >
      {/* 딤은 Figma "딤드"(nodeId 2159:110298) 그대로 검정 60% */}
      <button
        aria-label="사진 닫기"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-label={`${sectionName}구역 실제 사진`}
        aria-modal="true"
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-end gap-3 rounded-3xl bg-background-normal p-3"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <IconButton aria-label="닫기" onClick={onClose} size={24}>
          <IconClose />
        </IconButton>
        {/* Figma 사진 틀 300×224. Figma의 회전·확대 보정은 사진을 자를 때 끝낸다 */}
        <div className="h-56 w-[300px] overflow-hidden rounded-sm">
          <img
            alt={`${sectionName}구역 사물함 사진`}
            className="size-full object-cover"
            src={photoUrl}
          />
        </div>
        {/* Figma 2159:110379 — 카드 폭 전체에 가운데 정렬 */}
        <Typography
          as="p"
          color="semantic.label.alternative"
          sx={{ textAlign: "center", width: "100%" }}
          variant="caption2"
          weight="regular"
        >
          번호가 표시된 실제 배치 사진입니다.
        </Typography>
      </div>
    </div>,
    portalEl,
  );
}

export default LockersSectionPhotoModal;
