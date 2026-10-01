import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 공지 데이터를 받는 동안 NoticesDetailScreen에 보이는 자리 — 카테고리 뱃지, 제목, 등록일, 본문 문단을 따른다.
// 사진 유무는 공지마다 달라서 사진 자리는 그리지 않는다.
function NoticesDetailSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton("normal");

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-hidden px-5 pt-5">
      <div className="flex flex-col gap-2">
        <Skeleton
          animation={animation}
          height="24px"
          radius="8px"
          variant="rectangle"
          width="64px"
        />
        <Skeleton
          animation={animation}
          height="26px"
          radius="6px"
          variant="rectangle"
          width="80%"
        />
        <Skeleton
          animation={animation}
          height="14px"
          radius="4px"
          variant="rectangle"
          width="30%"
        />
      </div>
      <div className="flex flex-col gap-2">
        {SKELETON_ROW_KEYS.map((key) => (
          <Skeleton
            animation={animation}
            height="16px"
            key={key}
            radius="4px"
            variant="rectangle"
            width={key === "row-5" ? "60%" : "100%"}
          />
        ))}
      </div>
    </div>
  );
}

export default NoticesDetailSkeleton;
