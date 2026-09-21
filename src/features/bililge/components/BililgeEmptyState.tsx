import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

interface BililgeEmptyStateProps {
  illustration: string;
  title: string;
  description: string;
  action?: ReactNode;
}

// Figma: Empty State (반납 대상 nodeId 1410:55631, 대여 내역 nodeId 1410:55646) — 일러스트 자체가
// 64x64 박스 안에서 정확한 픽셀 크기(export SVG의 width/height 속성)로 이미 잡혀 있어서 별도로
// 사이즈를 지정하지 않고 flex 중앙 정렬만 해준다. action이 있으면(대여 내역) 텍스트-버튼 사이
// 간격이 20px, 없으면(반납 대상) 그 간격 자체가 없다 — Figma의 두 Empty State가 이 차이만 있다.
function BililgeEmptyState({
  illustration,
  title,
  description,
  action,
}: BililgeEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-5">
      <div className="flex size-16 shrink-0 items-center justify-center">
        <img alt="" src={illustration} />
      </div>
      <div className={`flex flex-col items-center ${action ? "gap-5" : ""}`}>
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography
            as="p"
            color="semantic.label.neutral"
            variant="body2"
            weight="bold"
          >
            {title}
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="caption1"
          >
            {description}
          </Typography>
        </div>
        {action}
      </div>
    </div>
  );
}

export default BililgeEmptyState;
