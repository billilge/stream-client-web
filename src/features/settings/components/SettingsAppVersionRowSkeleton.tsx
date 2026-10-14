import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 앱 버전 행 자리 — 라벨은 화면이 바로 그릴 수 없으니(행 전체가 데이터 컴포넌트) 같이 잡아 둔다.
function SettingsAppVersionRowSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex h-5 items-center justify-between">
      <Skeleton
        animation={animation}
        height="14px"
        radius="4px"
        variant="rectangle"
        width="42px"
      />
      <Skeleton
        animation={animation}
        height="14px"
        radius="4px"
        variant="rectangle"
        width="104px"
      />
    </div>
  );
}

export default SettingsAppVersionRowSkeleton;
