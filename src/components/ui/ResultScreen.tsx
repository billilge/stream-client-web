import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface ResultScreenAction {
  label: string;
  onClick: () => void;
}

// 그림과 문구 사이 간격. Figma가 마감·오류 화면은 16px, 완료 화면(체크 모션)은 8px로 잡아뒀다.
type ResultScreenIllustrationGap = 8 | 16;

const ILLUSTRATION_GAP_CLASS_NAMES: Record<
  ResultScreenIllustrationGap,
  string
> = {
  8: "gap-2",
  16: "gap-4",
};

interface ResultScreenProps {
  illustration: ReactNode;
  illustrationGap?: ResultScreenIllustrationGap;
  title: string;
  description: string;
  /** 문구 아래에 붙는 내용(완료 화면의 신청 요약 카드 등) */
  children?: ReactNode;
  primaryAction: ResultScreenAction;
  /** 있으면 두 버튼을 반반 나란히 두고, 이 버튼을 왼쪽(회색)에 둔다 */
  secondaryAction?: ResultScreenAction;
  onClose: () => void;
}

// 신청 결과 화면(완료·마감·오류) 공용 — 행사·사물함 신청이 같이 쓴다.
// Figma: 행사 신청 중 마감됨 (nodeId 1133:43431), 사물함 신청 오류 (3013:99093 외)
function ResultScreen({
  illustration,
  illustrationGap = 16,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  onClose,
}: ResultScreenProps) {
  useScreenHeader(
    <ScreenHeader
      trailing={
        <TopNavigationButton aria-label="닫기" onClick={onClose} variant="icon">
          <IconClose />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-6 px-5 pt-[104px]">
        <div
          className={`flex flex-col items-center ${ILLUSTRATION_GAP_CLASS_NAMES[illustrationGap]}`}
        >
          {illustration}
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="heading1"
              weight="bold"
            >
              {title}
            </Typography>
            {/* Figma 설명 문구는 줄바꿈 위치까지 디자인에 포함돼 있어서(예: 송금 확인요청 완료
                3562:163013) `\n`을 그대로 살린다. 기존 사용처는 모두 한 줄 문구라 영향이 없다. */}
            <Typography
              as="p"
              className="whitespace-pre-line"
              color="semantic.label.alternative"
              variant="label1"
              weight="regular"
            >
              {description}
            </Typography>
          </div>
        </div>
        {children}
      </div>

      <div className="shrink-0">
        {/* WDS는 버튼 세로 padding을 12px(48px)로 주는데 Figma Main Action은 16px(56px)이라 맞춘다 */}
        {secondaryAction ? (
          <ActionArea variant="neutral">
            <ActionAreaButton
              buttonColor="assistive"
              buttonVariant="solid"
              onClick={secondaryAction.onClick}
              sx={{ padding: "16px 28px" }}
              variant="alternative"
            >
              {secondaryAction.label}
            </ActionAreaButton>
            <ActionAreaButton
              onClick={primaryAction.onClick}
              sx={{ padding: "16px 28px" }}
            >
              {primaryAction.label}
            </ActionAreaButton>
          </ActionArea>
        ) : (
          <ActionArea>
            <ActionAreaButton
              onClick={primaryAction.onClick}
              sx={{ paddingBlock: "16px" }}
            >
              {primaryAction.label}
            </ActionAreaButton>
          </ActionArea>
        )}
        {/* ActionArea 아래 padding 20px + 14px = Figma Bottom Safe Area 34px. 앱 WebView에서는
            네이티브 세이프에어리어와 겹쳐서 데스크톱 프레임에서만 남긴다. */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default ResultScreen;
