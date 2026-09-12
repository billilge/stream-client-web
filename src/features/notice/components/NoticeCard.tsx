import pinIcon from "@/assets/icons/pin.svg";

interface NoticeCardProps {
  title: string;
  date: string;
  category: string;
  isPinned?: boolean;
  hasThumbnail?: boolean;
}

// Figma: Notice-card (nodeId 1256:81801) — Stream 로컬 컴포넌트, WDS 아님
// (docs/conventions/wds-component-usage.md "제외됨" 표 참고)
// 고정 핀 아이콘은 Icon/Normal/Pin(WDS)로 오판했던 것을 재검증해서 바로잡음 — 실제 Figma
// 에셋은 기울어진 모양 + #0066FF 고정색이라 wds-icon의 IconPin/IconPinFill(직선 모양)과
// 다른 도형이라 대응 export가 없다. src/assets/icons/pin.svg로 원본 SVG를 그대로 받아 씀.
function NoticeCard({
  title,
  date,
  category,
  isPinned = false,
  hasThumbnail = false,
}: NoticeCardProps) {
  return (
    <div
      className={`flex w-full items-center justify-between px-5 ${hasThumbnail ? "" : "py-[7px]"}`}
    >
      <div className="flex flex-1 flex-col gap-1">
        {hasThumbnail ? (
          <div className="flex items-center gap-1">
            {isPinned && <img alt="" className="size-5" src={pinIcon} />}
            <p className="whitespace-nowrap text-[15px] text-label-normal">
              {title}
            </p>
          </div>
        ) : (
          <p className="text-[15px] text-label-normal">{title}</p>
        )}
        <p className="text-label-alternative text-xs">
          {date} | {category}
        </p>
      </div>
      {/* #d9d9d9는 실제 공지 썸네일 이미지가 아직 없어 Figma가 그대로 쓰는 자리표시 회색이라 시맨틱 토큰 없이 하드코딩 */}
      {hasThumbnail && (
        <div className="size-14 shrink-0 rounded-lg bg-[#d9d9d9]" />
      )}
    </div>
  );
}

export default NoticeCard;
