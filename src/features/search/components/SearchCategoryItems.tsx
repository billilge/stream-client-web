import { Divider } from "@wanteddev/wds";
import { Fragment, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import EventsCard from "@/features/events/components/EventsCard";
import FeedbacksCard from "@/features/feedbacks/components/FeedbacksCard";
import NoticesCard from "@/features/notices/components/NoticesCard";
import SearchArchivingCard from "@/features/search/components/SearchArchivingCard";
import type {
  SearchCategory,
  SearchResults,
} from "@/features/search/constants/search";

interface SearchCategoryItemsProps {
  category: SearchCategory;
  results: SearchResults;
  /** 전체 탭 미리보기처럼 앞에서 몇 개만 보여줄 때 */
  limit?: number;
  /** 목록 맨 아래에 같은 간격으로 붙는 요소 — 전체 탭의 "n개 더보기" 버튼 */
  footer?: ReactNode;
}

interface ListEntry {
  id: string;
  node: ReactNode;
}

// 카테고리별 카드 간격과 구분선 유무는 Figma 검색 완료 화면(nodeId 3147:138695)에서 실측한 값이다.
// 행사는 카드가 112px이라 간격 24, 공지·아카이빙·열린피드백은 56px 카드라 간격 16(구분선 있음),
// 빌릴게는 테두리 카드끼리 간격 8이고 구분선이 없다.
const LIST_STYLE: Record<
  SearchCategory,
  { gapClassName: string; hasDivider: boolean }
> = {
  archives: { gapClassName: "gap-4", hasDivider: true },
  bililge: { gapClassName: "gap-2", hasDivider: false },
  events: { gapClassName: "gap-6", hasDivider: true },
  feedbacks: { gapClassName: "gap-4", hasDivider: true },
  notices: { gapClassName: "gap-4", hasDivider: true },
};

// 검색 결과 한 카테고리의 카드 목록. 카드는 기존 화면의 것을 그대로 재사용하고(행사·공지·열린피드백),
// 설계서 4번의 "UI가 달라지는 카드" 둘만 검색용으로 바꿨다 — 아카이빙(SearchArchivingCard, 신규),
// 빌릴게(BililgeItemCard의 bordered).
function SearchCategoryItems({
  category,
  results,
  limit,
  footer,
}: SearchCategoryItemsProps) {
  const navigate = useNavigate();

  const buildEntries = (): ListEntry[] => {
    switch (category) {
      case "events":
        return results.events.map((event) => ({
          id: event.id,
          node: (
            <EventsCard
              actionLabel={event.actionLabel}
              eventDate={event.eventDate}
              onApply={() => navigate(`/events/${event.id}/apply`)}
              onSelect={() => navigate(`/events/${event.id}`)}
              status={event.status}
              statusLabel={event.statusLabel}
              title={event.title}
            />
          ),
        }));
      case "notices":
        return results.notices.map((notice) => ({
          id: notice.id,
          node: (
            <Link className="block" to={`/notices/${notice.id}`}>
              <NoticesCard
                category={notice.category}
                date={notice.date}
                hasThumbnail={notice.hasThumbnail}
                isPinned={notice.isPinned}
                title={notice.title}
              />
            </Link>
          ),
        }));
      case "feedbacks":
        return results.feedbacks.map((feedback) => ({
          id: feedback.id,
          // 답변이 있는 피드백만 상세(모아보기)가 있다 — 열린피드백 목록과 같은 규칙
          node: feedback.answer ? (
            <Link className="block" to={`/feedbacks/${feedback.id}`}>
              <FeedbacksCard
                question={feedback.question}
                round={feedback.round}
              />
            </Link>
          ) : (
            <FeedbacksCard
              question={feedback.question}
              round={feedback.round}
            />
          ),
        }));
      case "archives":
        return results.archives.map((archive) => ({
          id: archive.id,
          node: (
            <SearchArchivingCard date={archive.date} title={archive.title} />
          ),
        }));
      case "bililge":
        return results.bililge.map((item) => ({
          id: item.id,
          node: (
            <div className="px-5">
              <BililgeItemCard
                bordered
                // 대여 바텀시트는 빌릴게 화면 안의 상태라 검색에서는 빌릴게 화면으로 보낸다.
                icon={item.icon}
                itemName={item.name}
                onRentRequest={() => navigate("/bililge")}
                subtitle={`수량 ${item.quantity}`}
              />
            </div>
          ),
        }));
    }
  };

  const { gapClassName, hasDivider } = LIST_STYLE[category];
  const allEntries = buildEntries();
  const entries = limit === undefined ? allEntries : allEntries.slice(0, limit);

  return (
    <div className={`flex flex-col ${gapClassName}`}>
      {entries.map((entry, index) => (
        <Fragment key={entry.id}>
          {hasDivider && index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          {entry.node}
        </Fragment>
      ))}
      {footer}
    </div>
  );
}

export default SearchCategoryItems;
