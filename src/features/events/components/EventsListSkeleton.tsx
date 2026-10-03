import { Divider, Skeleton } from "@wanteddev/wds";
import { Fragment } from "react";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 행사 목록 데이터를 받는 동안 EventsListScreen의 목록 자리에 보이는 스켈레톤 — 헤더·토글·필터는
// 화면이 바로 그리므로 행사 카드(EventsCard: 112px 썸네일 + 뱃지·제목·날짜 + 우하단 버튼) 배치만 따른다.
function EventsListSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      {SKELETON_ROW_KEYS.map((key, index) => (
        <Fragment key={key}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <div className="flex items-center gap-3 px-5">
            <Skeleton
              animation={animation}
              height="112px"
              radius="12px"
              variant="rectangle"
              width="112px"
            />
            <div className="flex h-28 flex-1 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton
                  animation={animation}
                  height="22px"
                  radius="6px"
                  variant="rectangle"
                  width="56px"
                />
                <Skeleton
                  animation={animation}
                  height="18px"
                  radius="4px"
                  variant="rectangle"
                  width="85%"
                />
                <Skeleton
                  animation={animation}
                  height="14px"
                  radius="4px"
                  variant="rectangle"
                  width="50%"
                />
              </div>
              <div className="flex justify-end">
                <Skeleton
                  animation={animation}
                  height="32px"
                  radius="8px"
                  variant="rectangle"
                  width="80px"
                />
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default EventsListSkeleton;
