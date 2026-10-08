import { ActionArea, TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// 본문 스택 간격. Figma가 화면마다 다르게 잡아뒀다 —
// 토스 안내·실패는 8px(3562:163031), 송금 확인은 12px(3562:162979),
// 입력이 있는 단계는 16px(3562:162839, 3562:162853).
type FeeTransferContentGap = 8 | 12 | 16;

const CONTENT_GAP_CLASS_NAMES: Record<FeeTransferContentGap, string> = {
  8: "gap-2",
  12: "gap-3",
  16: "gap-4",
};

interface FeeTransferStepLayoutProps {
  /** 제목 위에 놓이는 48px 일러스트 */
  illustration?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  contentGap?: FeeTransferContentGap;
  /** 제목/설명 아래에 붙는 입력·카드 등 */
  children?: ReactNode;
  /** ActionArea 안에 들어갈 버튼들 */
  actions: ReactNode;
  /**
   * 주 버튼 아래에 텍스트 버튼을 세로로 쌓을 때(송금 확인 화면) `"strong"`을 준다 —
   * WDS가 그때만 세로 배치 + 8px 간격이 되어 Figma Contents(3562:162974)와 맞는다.
   */
  actionsVariant?: "strong";
}

// Figma: 계좌 송금 플로우 5개 화면이 공유하는 뼈대 —
// 남은 학기 수(3562:162833) / 학점이수현황 업로드(3562:162845) /
// 토스 이동 안내(3562:163025) / 토스 이동 실패(3562:163046) / 송금 확인(3562:162973).
//
// 다섯 화면 모두 `뒤로가기만 있는 헤더 → 12px → (일러스트) 제목·설명 → 본문 → 하단 고정 버튼`
// 구조가 같고 간격과 문구만 다르다. 제목은 Label/Strong(#000000)으로, 설명은
// Label/Alternative로 고정이라 prop으로 빼지 않았다.
//
// 완료 화면(3562:163013)만 이 뼈대를 쓰지 않는다 — 뒤로가기가 아니라 X로 닫고 중앙 정렬이라
// 신청 결과 화면 공용 컴포넌트(ResultScreen)와 같은 모양이다.
function FeeTransferStepLayout({
  illustration,
  title,
  description,
  contentGap = 16,
  children,
  actions,
  actionsVariant,
}: FeeTransferStepLayoutProps) {
  const navigate = useNavigate();

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
    <div className="flex h-full flex-col bg-background-normal">
      {/* Figma Student Fee Transfer Content: 헤더 아래 12px */}
      <div
        className={`scrollbar-hidden flex flex-1 flex-col overflow-y-auto px-5 pt-3 ${CONTENT_GAP_CLASS_NAMES[contentGap]}`}
      >
        {illustration}
        <div className="flex flex-col gap-2">
          <Typography
            as="h1"
            color="semantic.label.strong"
            variant="heading1"
            weight="bold"
          >
            {title}
          </Typography>
          {description && (
            // Figma 설명 문구는 줄바꿈 위치까지 디자인에 포함돼 있다
            <Typography
              as="p"
              className="whitespace-pre-line"
              color="semantic.label.alternative"
              variant="body2"
              weight="regular"
            >
              {description}
            </Typography>
          )}
        </div>
        {children}
      </div>

      <div className="shrink-0">
        <ActionArea variant={actionsVariant}>{actions}</ActionArea>
        {/* 다른 하단 고정 버튼 화면과 같은 14px — WDS ActionArea 아래 padding 20px에 Home Bar 여백을 더해 34px */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default FeeTransferStepLayout;
