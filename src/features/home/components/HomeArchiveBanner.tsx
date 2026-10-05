import { Typography } from "@wanteddev/wds";

import archiveFolder from "@/assets/icons/home/archive-folder.svg";

// Figma: Archive CTA (nodeId 3147:146288)
function HomeArchiveBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-[167.2deg] from-54% from-background-normal to-[153.5%] to-archive-cta-fade p-4">
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
      <div className="absolute top-[15px] right-0 flex h-[69.85px] w-[82.23px] items-center justify-center">
        <img
          alt=""
          className="h-[57.86px] w-[73.18px] rotate-[10.15deg]"
          src={archiveFolder}
        />
      </div>
    </div>
  );
}

export default HomeArchiveBanner;
