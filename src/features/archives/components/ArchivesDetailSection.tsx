import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import activityIcon from "@/assets/icons/archives/activity.svg";
import cameraIcon from "@/assets/icons/archives/camera.svg";
import linkIcon from "@/assets/icons/archives/link.svg";

export type ArchivesDetailSectionIcon = "activity" | "camera" | "link";

interface ArchivesDetailSectionProps {
  icon: ArchivesDetailSectionIcon;
  title: string;
  children: ReactNode;
}

// Figma에서 아이콘마다 24px 프레임 안 그림 위치가 달라서, 받은 그림 SVG를 프레임 기준 위치 그대로 배치한다.
const ICONS: Record<
  ArchivesDetailSectionIcon,
  { src: string; className: string }
> = {
  activity: {
    className:
      "top-[calc(50%-0.16px)] left-[calc(50%+0.92px)] h-[16.187px] w-[18.162px] -translate-x-1/2 -translate-y-1/2",
    src: activityIcon,
  },
  camera: {
    className: "inset-[8.33%_8.33%_14.89%_8.33%]",
    src: cameraIcon,
  },
  link: {
    className: "inset-[12.5%_12.5%_12.48%_12.5%]",
    src: linkIcon,
  },
};

// Figma: 아카이빙 상세 Activity/Photos/Links Section (nodeId 1526:171236, 1526:171242, 1526:171260)
// 섹션 위의 8px 회색 구분선(Figma "Divider-new")도 여기서 같이 그린다 — 모든 섹션 앞에 붙어 있다.
function ArchivesDetailSection({
  icon,
  title,
  children,
}: ArchivesDetailSectionProps) {
  return (
    <>
      <div className="h-2 w-full shrink-0 bg-background-alternative" />
      <section className="flex flex-col gap-3 px-5">
        <div className="flex items-center gap-1">
          <div className="relative size-6 shrink-0 overflow-hidden">
            <img
              alt=""
              className={`absolute ${ICONS[icon].className}`}
              src={ICONS[icon].src}
            />
          </div>
          <Typography
            as="h3"
            color="semantic.label.normal"
            variant="headline2"
            weight="bold"
          >
            {title}
          </Typography>
        </div>
        {children}
      </section>
    </>
  );
}

export default ArchivesDetailSection;
