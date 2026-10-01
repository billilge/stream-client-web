import { Typography } from "@wanteddev/wds";

interface LockersMapAreaProps {
  label: string;
  icon?: string;
  /** 크기·배치(flex 비율, 폭, 세로 여백 등) — 화면마다 다르다 */
  className?: string;
}

// Figma: 호실·화장실·계단·옆 구역처럼 고를 수 없는 자리(Room Label·Zone Label·Stairs Area) — Stream 로컬.
// 점선 테두리 흰 상자 가운데에 라벨(+ 아이콘)을 둔다. 구역 평면도와 구역별 칸 배치가 같이 쓴다.
function LockersMapArea({ label, icon, className = "" }: LockersMapAreaProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line-solid-normal border-dashed bg-background-normal ${className}`}
    >
      <div className="flex items-center gap-0.5">
        {icon !== undefined && (
          <img alt="" className="size-6 shrink-0" src={icon} />
        )}
        <Typography
          as="p"
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {label}
        </Typography>
      </div>
    </div>
  );
}

export default LockersMapArea;
