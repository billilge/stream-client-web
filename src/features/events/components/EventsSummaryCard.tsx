// Figma: Event Summary — 신청 폼(nodeId 1658:183393), 신청 완료(nodeId 1712:192310)
import { Typography } from "@wanteddev/wds";
import { IconClock, IconLocation } from "@wanteddev/wds-icon";

interface EventsSummaryCardProps {
  eventName: string;
  dateTime: string;
  location: string;
  // 일러스트는 행사마다 다르다(디자이너가 행사별로 준비) — API 연동 전까지는 목업 에셋 src를 받는다.
  // 완료 화면 카드처럼 일러스트를 안 쓰는 자리도 있어서 선택이다.
  illustration?: string;
  // 같은 카드를 Figma가 화면마다 조금씩 다르게 그려뒀다.
  // normal(신청 폼, 회색 배경 위): 흰 카드 + 행사명 Heading 2(20px) + 메타 간격 6px
  // alternative(신청 완료, 흰 배경 위): 회색 카드 + 행사명 Headline 2(17px) + 메타 간격 4px
  tone?: "normal" | "alternative";
}

function EventsSummaryCard({
  eventName,
  dateTime,
  location,
  illustration,
  tone = "normal",
}: EventsSummaryCardProps) {
  const isAlternative = tone === "alternative";

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 ${
        isAlternative ? "bg-background-alternative" : "bg-background-normal"
      }`}
    >
      {/* Figma처럼 카드 오른쪽 위에 비스듬히 걸쳐 두고 카드 밖으로 나간 부분은 잘라낸다 */}
      {illustration !== undefined && (
        <img
          alt=""
          className="absolute top-[11px] right-[11px] size-[105px] rotate-[17.35deg]"
          src={illustration}
        />
      )}
      <div className="relative flex flex-col gap-2">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant={isAlternative ? "headline2" : "heading2"}
          weight="bold"
        >
          {eventName}
        </Typography>
        <div className={`flex flex-col ${isAlternative ? "gap-1" : "gap-1.5"}`}>
          <div className="flex items-center gap-1">
            <IconClock className="size-[18px] shrink-0 text-label-assistive" />
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {dateTime}
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <IconLocation className="size-[18px] shrink-0 text-label-assistive" />
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {location}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsSummaryCard;
