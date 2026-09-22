import { Button, Typography } from "@wanteddev/wds";
import { useEffect, useId, useRef } from "react";
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
// BottomSheet와 같은 방식으로 ScreenLayout의 포털 슬롯에 그려서 화면 컬럼 전체를 덮는다.
//
// 다이얼로그 접근성(코드리뷰 지적 반영): role="dialog"/aria-modal, 열릴 때 기본 액션으로 포커스
// 이동, Tab이 두 버튼 밖으로 안 나가게 트랩, Esc로 닫기, 닫힐 때 이전 포커스 복원, 닫혀있을 땐
// inert로 포커스/접근성 트리에서 제외.
function BililgeReturnConfirmModal({
  open,
  onCancel,
  onConfirm,
}: BililgeReturnConfirmModalProps) {
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
      // 탭 키가 숨겨진 버튼으로 계속 들어가는 문제(CodeRabbit 지적)를 못 막는다.
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
        className="relative flex w-[311px] flex-col items-center gap-6 rounded-3xl bg-background-normal px-5 pt-6 pb-5 sm:w-[416px]"
        role="dialog"
      >
        <div className="flex flex-col gap-1 text-center">
          <Typography
            as="p"
            color="semantic.label.normal"
            id={titleId}
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

export default BililgeReturnConfirmModal;
