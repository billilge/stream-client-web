import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

const ROW_KEYS = ["fee", "feedbacks", "lockers"];

// 홈 데이터를 받는 동안 HomeInfoList 자리에 보이는 스켈레톤 — 흰 카드 안에 학생회비·열린피드백·사물함
// 세 줄(아이콘 42px·제목·배지)의 배치를 따른다.
function HomeInfoListSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
      {ROW_KEYS.map((key) => (
        <div className="flex items-center gap-3" key={key}>
          <Skeleton
            animation={animation}
            height="42px"
            radius="8px"
            variant="rectangle"
            width="42px"
          />
          <Skeleton
            animation={animation}
            height="16px"
            radius="4px"
            variant="rectangle"
            width="40%"
          />
          <div className="ml-auto">
            <Skeleton
              animation={animation}
              height="20px"
              radius="4px"
              variant="rectangle"
              width="52px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeInfoListSkeleton;
