import { Divider, Skeleton } from "@wanteddev/wds";
import { Fragment } from "react";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 신청내역을 받는 동안 보이는 스켈레톤 — 신청내역 카드(70px 썸네일 + 배지·제목·날짜 + 버튼 두 개) 배치만 따른다.
function EventsApplicationListSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-6 overflow-hidden pt-6">
      {SKELETON_ROW_KEYS.map((key, index) => (
        <Fragment key={key}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <div className="flex flex-col gap-4 px-5">
            <div className="flex items-center gap-3">
              <Skeleton
                animation={animation}
                height="70px"
                radius="12px"
                variant="rectangle"
                width="70px"
              />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton
                  animation={animation}
                  height="24px"
                  radius="6px"
                  variant="rectangle"
                  width="56px"
                />
                <Skeleton
                  animation={animation}
                  height="20px"
                  radius="4px"
                  variant="rectangle"
                  width="80%"
                />
                <Skeleton
                  animation={animation}
                  height="16px"
                  radius="4px"
                  variant="rectangle"
                  width="50%"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Skeleton
                  animation={animation}
                  height="32px"
                  radius="8px"
                  variant="rectangle"
                  width="100%"
                />
              </div>
              <div className="flex-1">
                <Skeleton
                  animation={animation}
                  height="32px"
                  radius="8px"
                  variant="rectangle"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default EventsApplicationListSkeleton;
