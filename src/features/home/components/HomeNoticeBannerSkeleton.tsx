import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 홈 데이터를 받는 동안 HomeNoticeBanner 자리에 보이는 스켈레톤 — 배너 카드 한 장(높이 261px)의 자리를 채운다.
function HomeNoticeBannerSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="h-notice-banner px-5">
      <Skeleton
        animation={animation}
        height="100%"
        radius="12px"
        variant="rectangle"
        width="100%"
      />
    </div>
  );
}

export default HomeNoticeBannerSkeleton;
