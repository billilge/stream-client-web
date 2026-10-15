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

// SVG 파일이 Figma의 24x24 프레임 그대로라(그림 위치도 그 안에 들어 있다) 위치 보정 없이 그린다.
const ICON_SOURCES: Record<ArchivesDetailSectionIcon, string> = {
  activity: activityIcon,
  camera: cameraIcon,
  link: linkIcon,
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
          <img alt="" className="size-6 shrink-0" src={ICON_SOURCES[icon]} />
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
