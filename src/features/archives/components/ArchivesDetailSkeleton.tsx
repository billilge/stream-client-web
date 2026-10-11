import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 아카이빙 상세 데이터를 받는 동안 보이는 스켈레톤 — 상세 배치(정사각 대표 사진 → 제목·정보 →
// 섹션들)를 따라가서, 데이터가 들어올 때 본문이 밀려 내려가지 않게 한다.
function ArchivesDetailSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-hidden">
      <Skeleton
        animation={animation}
        height="auto"
        sx={{ aspectRatio: "1 / 1", width: "100%" }}
        variant="rectangle"
        width="100%"
      />

      <div className="flex flex-col gap-4 px-5">
        <Skeleton
          animation={animation}
          height="30px"
          radius="6px"
          variant="rectangle"
          width="70%"
        />
        <div className="flex flex-col gap-2">
          <Skeleton
            animation={animation}
            height="20px"
            radius="4px"
            variant="rectangle"
            width="60%"
          />
          <Skeleton
            animation={animation}
            height="20px"
            radius="4px"
            variant="rectangle"
            width="55%"
          />
          <Skeleton
            animation={animation}
            height="20px"
            radius="4px"
            variant="rectangle"
            width="50%"
          />
        </div>
      </div>

      <div className="h-2 w-full shrink-0 bg-background-alternative" />

      <div className="flex flex-col gap-3 px-5">
        <Skeleton
          animation={animation}
          height="24px"
          radius="4px"
          variant="rectangle"
          width="96px"
        />
        <Skeleton
          animation={animation}
          height="66px"
          radius="4px"
          variant="rectangle"
          width="100%"
        />
      </div>

      <div className="h-2 w-full shrink-0 bg-background-alternative" />

      <div className="flex flex-col gap-3 px-5">
        <Skeleton
          animation={animation}
          height="24px"
          radius="4px"
          variant="rectangle"
          width="96px"
        />
        <div className="flex gap-2">
          {["photo-1", "photo-2", "photo-3"].map((key) => (
            <Skeleton
              animation={animation}
              height="auto"
              key={key}
              radius="8px"
              sx={{ aspectRatio: "1 / 1", flex: 1 }}
              variant="rectangle"
              width="100%"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArchivesDetailSkeleton;
