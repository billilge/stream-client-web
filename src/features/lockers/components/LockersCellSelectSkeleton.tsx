import { useScreenHeaderSkeleton } from "@/components/ui/ScreenSkeleton";
import LockersMineSkeleton from "@/features/lockers/components/LockersMineSkeleton";

// 헤더 제목이 구역 이름이라 헤더 자리도 같이 채운다. 본문은 위치 보기와 같은 미니맵 + 칸 배치 배치다.
function LockersCellSelectSkeleton() {
  useScreenHeaderSkeleton();
  return <LockersMineSkeleton />;
}

export default LockersCellSelectSkeleton;
