import { Typography } from "@wanteddev/wds";

import archiveFolder from "@/assets/icons/home/archive-folder.svg";

// Figma: Archive CTA (nodeId 3147:146288)
function HomeArchiveBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-archive-cta p-4">
      <Typography
        as="p"
        color="semantic.label.normal"
        variant="body1"
        weight="bold"
      >
        아카이빙 둘러보기
      </Typography>
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="regular"
      >
        지난 활동과 기록을 한번에
      </Typography>
      {/* 폴더 그림은 Figma 회전(10.15°)을 SVG에 반영해 둬서 고유 크기 그대로 놓는다 */}
      <img alt="" className="absolute top-3.75 right-0" src={archiveFolder} />
    </div>
  );
}

export default HomeArchiveBanner;
