import { Divider, Skeleton } from "@wanteddev/wds";
import { Fragment } from "react";

import {
  SKELETON_ROW_KEYS,
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 사진이 있는 공지만 우측에 56px 썸네일이 붙는다(NoticesCard). 목록이 한 모양으로 반복돼 보이지 않게
// 실제 목데이터처럼 몇 행에만 둔다.
const ROWS_WITH_THUMBNAIL = new Set(["row-1", "row-2", "row-5"]);

// NoticesListScreen(게시판 공지 탭)이 로딩되는 동안의 자리 — 카테고리 탭 줄, 제목·날짜 행을 따른다.
function NoticesListSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 gap-6 px-5 py-3">
        <Skeleton
          animation={animation}
          height="22px"
          radius="6px"
          variant="rectangle"
          width="36px"
        />
        <Skeleton
          animation={animation}
          height="22px"
          radius="6px"
          variant="rectangle"
          width="60px"
        />
        <Skeleton
          animation={animation}
          height="22px"
          radius="6px"
          variant="rectangle"
          width="60px"
        />
      </div>
      <div className="flex flex-col gap-4 overflow-hidden py-4">
        {SKELETON_ROW_KEYS.map((key, index) => (
          <Fragment key={key}>
            {index > 0 && (
              <div className="px-5">
                <Divider color="semantic.line.normal.alternative" />
              </div>
            )}
            <div className="flex h-14 items-center justify-between gap-4 px-5">
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton
                  animation={animation}
                  height="18px"
                  radius="4px"
                  variant="rectangle"
                  width="75%"
                />
                <Skeleton
                  animation={animation}
                  height="14px"
                  radius="4px"
                  variant="rectangle"
                  width="35%"
                />
              </div>
              {ROWS_WITH_THUMBNAIL.has(key) && (
                <Skeleton
                  animation={animation}
                  height="56px"
                  radius="8px"
                  variant="rectangle"
                  width="56px"
                />
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default NoticesListSkeleton;
