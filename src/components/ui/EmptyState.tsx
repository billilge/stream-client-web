import { Button, Typography } from "@wanteddev/wds";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  /** 행사(1165:62920)는 테두리만 있는 outlined, 열린피드백 작성내역(3147:147823)은 회색 solid다 */
  variant?: "outlined" | "solid";
}

interface EmptyStateProps {
  /** 그림 SVG — 81px 그림 자리 가운데에 SVG 자체 크기로 놓는다 */
  illustration: string;
  title: string;
  /** 카드 안의 작은 빈 화면(사물함 배정 상태 3147:148336)만 body2다 */
  titleVariant?: "headline1" | "body2";
  description?: string;
  /** 설명 굵기 — 행사 목록 empty(1165:62725)·행사 상세 없음만 Medium이고 나머지는 Regular다 */
  descriptionWeight?: "medium" | "regular";
  /** 있을 때만 버튼을 노출한다 — 문구와 동작을 한 묶음으로 받아, 동작 없는 버튼이 그려지지 않게 한다 */
  action?: EmptyStateAction;
}

// Figma: Empty State — 행사 모집중 empty (nodeId 1165:62725), 열린피드백 작성내역 empty (3147:147823),
// 알림 empty (3595:107512), 검색 결과 empty (3147:138778), 사물함 배정 상태 empty (3147:148336).
// 그림 → 제목·설명 → (선택) 작은 버튼 뼈대가 같고 그림·문구·버튼 모양만 달라서 하나로 둔다.
// Stream 로컬 컴포넌트다(wds-component-usage.md "제외됨" 표의 `Empty State`). WDS FallbackView는 구조는 같지만
// 일러스트 128/160px·상하 패딩 80/160px·타이틀 label.normal이라 Figma(81px·패딩 없음·label/neutral)와 달라서
// 내부를 오버라이드해야 한다(컨벤션상 금지) — 바깥 레이아웃만 로컬로 짜고 내부 요소는 WDS로 채운다.
// Figma 컨테이너 폭(203px 등)은 가장 긴 문구에 맞춘 값이라 고정하지 않고 문구 폭에 맡긴다 — 고정하면 폰트 폭이
// 조금만 달라도(Pretendard를 못 불러온 환경 등) 마지막 글자가 다음 줄로 넘어간다.
function EmptyState({
  illustration,
  title,
  titleVariant = "headline1",
  description,
  descriptionWeight = "regular",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex size-20.25 shrink-0 items-center justify-center">
        <img alt="" src={illustration} />
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography
            align="center"
            color="semantic.label.neutral"
            variant={titleVariant}
            weight="bold"
          >
            {title}
          </Typography>
          {description && (
            <Typography
              align="center"
              color="semantic.label.alternative"
              variant="label1"
              weight={descriptionWeight}
            >
              {description}
            </Typography>
          )}
        </div>

        {action && (
          <Button
            color="assistive"
            onClick={action.onClick}
            size="small"
            variant={action.variant ?? "outlined"}
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
