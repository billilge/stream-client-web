// Figma: Event Summary (nodeId 1658:183393)
import { Typography } from "@wanteddev/wds";
import { IconClock, IconLocation } from "@wanteddev/wds-icon";

interface EventsSummaryCardProps {
  eventName: string;
  dateTime: string;
  location: string;
  illustration: string;
}

// 일러스트는 행사마다 다르다(디자이너가 행사별로 준비) — API 연동 전까지는 목업 에셋 src를 받는다.
function EventsSummaryCard({
  eventName,
  dateTime,
  location,
  illustration,
}: EventsSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-background-normal p-4">
      {/* Figma처럼 카드 오른쪽 위에 비스듬히 걸쳐 두고 카드 밖으로 나간 부분은 잘라낸다 */}
      <img
        alt=""
        className="absolute top-[11px] right-[11px] size-[105px] rotate-[17.35deg]"
        src={illustration}
      />
      <div className="relative flex flex-col gap-2">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          {eventName}
        </Typography>
        <div className="flex flex-col gap-1.5">
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
