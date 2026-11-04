import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Divider } from "@wanteddev/wds";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import NoticesCard from "@/features/notices/components/NoticesCard";
import {
  formatNoticeDate,
  getNoticePath,
  NOTICE_CATEGORY_LABELS,
} from "@/features/notices/constants/notices";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { noticesQueries } from "@/shared/entities/notices/noticesQueries";
import type { NoticeCategoryCode } from "@/shared/entities/notices/noticesTypes";

interface NoticesListProps {
  /** null이면 거르지 않는 전체 목록이다 */
  category: NoticeCategoryCode | null;
}

// 공지 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 NoticesListScreen의 Suspense가
// NoticesListSkeleton을 보여준다. 카테고리는 서버가 걸러 준다 — 페이지로 나눠 받아서 받은 것만 거르면
// 다음 페이지의 공지가 빠진다. 스크롤이 끝에 닿으면 다음 페이지를 이어 받는다.
function NoticesList({ category }: NoticesListProps) {
  const {
    data: notices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...noticesQueries.list(category),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4">
        {notices.map((notice, index) => (
          <Fragment key={notice.noticeId}>
            {index > 0 && (
              <div className="px-5">
                <Divider color="semantic.line.normal.alternative" />
              </div>
            )}
            <Link
              className="block"
              to={getNoticePath(notice.noticeId)}
              viewTransition
            >
              <NoticesCard
                category={NOTICE_CATEGORY_LABELS[notice.category]}
                date={formatNoticeDate(notice.createdAt)}
                hasThumbnail={Boolean(notice.thumbnailUrl)}
                isPinned={notice.pinned}
                thumbnailUrl={notice.thumbnailUrl}
                title={notice.title}
              />
            </Link>
          </Fragment>
        ))}
      </div>
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </div>
  );
}

export default NoticesList;
