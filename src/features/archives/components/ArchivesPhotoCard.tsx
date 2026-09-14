// Figma: Archives Photo Card (Left-Large 1276:95411, Left-Medium 1276:95412, Right-Small 1276:95416)
export type ArchivesPhotoCardSize = "small" | "medium" | "large";

interface ArchivesPhotoCardProps {
  image: string;
  title: string;
  date: string;
  size: ArchivesPhotoCardSize;
}

const HEIGHT_CLASS_NAMES: Record<ArchivesPhotoCardSize, string> = {
  large: "h-[258px]",
  medium: "h-[220px]",
  small: "h-[184px]",
};

// Figma의 Left-*/Right-* variant는 열 위치만 다르고 구조는 같아서 높이(size) 하나로 합쳤다.
// Figma에선 사진마다 마스크 위치를 수동으로 잡아뒀지만, 실제 API 이미지는 크기가 제각각이라 object-cover 가운데 정렬로 통일한다.
function ArchivesPhotoCard({
  image,
  title,
  date,
  size,
}: ArchivesPhotoCardProps) {
  return (
    <div
      className={`relative flex w-full flex-col justify-end overflow-hidden rounded-xl px-3 py-4 ${HEIGHT_CLASS_NAMES[size]}`}
    >
      <img
        alt=""
        className="absolute inset-0 size-full object-cover"
        src={image}
      />
      <div className="absolute inset-0 bg-linear-to-t from-gradient-overlay to-40% to-transparent" />
      <div className="relative flex flex-col">
        <p className="font-medium text-sm text-static-white">{title}</p>
        <p className="text-[11px] text-cool-neutral-80 leading-[14px]">
          {date}
        </p>
      </div>
    </div>
  );
}

export default ArchivesPhotoCard;
