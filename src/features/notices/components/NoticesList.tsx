import { useSuspenseQuery } from "@tanstack/react-query";
import { Divider } from "@wanteddev/wds";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import { noticesQueries } from "@/entities/notices/noticesQueries";
import type { NoticeCategory } from "@/entities/notices/types";
import NoticesCard from "@/features/notices/components/NoticesCard";

interface NoticesListProps {
  category: NoticeCategory | "all";
}

// 공지 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 NoticesListScreen의 Suspense가
// NoticesListSkeleton을 보여준다.
function NoticesList({ category }: NoticesListProps) {
  const { data } = useSuspenseQuery(noticesQueries.list());
  const notices = data.filter(
    (notice) => category === "all" || notice.category === category,
  );

  return (
    <div className="flex flex-col gap-4 py-4">
      {notices.map((notice, index) => (
        <Fragment key={notice.id}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <Link className="block" to={`/notices/${notice.id}`} viewTransition>
            <NoticesCard
              category={notice.category}
              date={notice.date}
              hasThumbnail={notice.hasThumbnail}
              isPinned={notice.isPinned}
              title={notice.title}
            />
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

export default NoticesList;
