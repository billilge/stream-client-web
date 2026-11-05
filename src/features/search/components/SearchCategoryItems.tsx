import { Divider } from "@wanteddev/wds";
import { Fragment, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import EventsCard from "@/features/events/components/EventsCard";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import FeedbacksCard from "@/features/feedbacks/components/FeedbacksCard";
import {
  formatFeedbackRound,
  getFeedbackPath,
  hasFeedbackAnswer,
} from "@/features/feedbacks/constants/feedbacks";
import NoticesCard from "@/features/notices/components/NoticesCard";
import {
  formatNoticeDate,
  getNoticePath,
  NOTICE_CATEGORY_LABELS,
} from "@/features/notices/constants/notices";
import SearchArchivingCard from "@/features/search/components/SearchArchivingCard";
import type {
  SearchCategory,
  SearchCategoryEntries,
} from "@/features/search/constants/search";
import { formatDate } from "@/lib/date";

interface SearchCategoryItemsProps {
  entries: SearchCategoryEntries;
  /** 목록 맨 아래에 같은 간격으로 붙는 요소 — 전체 탭의 "n개 더보기" 버튼 */
  footer?: ReactNode;
}

interface ListEntry {
  id: number;
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
  billilge: { gapClassName: "gap-2", hasDivider: false },
  events: { gapClassName: "gap-6", hasDivider: true },
  feedbacks: { gapClassName: "gap-4", hasDivider: true },
  notices: { gapClassName: "gap-4", hasDivider: true },
};

// 검색 결과 한 카테고리의 카드 목록. 카드는 서버 목록 응답을 받아 기존 화면의 것을 그대로 재사용하고(행사·공지·열린피드백),
// 설계서 4번의 "UI가 달라지는 카드" 둘만 검색용으로 바꿨다 — 아카이빙(SearchArchivingCard, 신규),
// 빌릴게(BillilgeItemCard의 bordered).
function SearchCategoryItems({ entries, footer }: SearchCategoryItemsProps) {
  const navigate = useNavigate();

  const buildEntries = (): ListEntry[] => {
    switch (entries.category) {
      case "events":
        return entries.items.map((event) => ({
          id: event.eventId,
          node: (
            <EventsCard
              event={event}
              onApply={() => navigate(`/events/${event.eventId}/apply`)}
              onSelect={() => navigate(`/events/${event.eventId}`)}
              onViewApplication={(applicationId) =>
                navigate(`${EVENTS_TAB_PATHS.application}/${applicationId}`)
              }
            />
          ),
        }));
      case "notices":
        return entries.items.map((notice) => ({
          id: notice.noticeId,
          node: (
            <Link className="block" to={getNoticePath(notice.noticeId)}>
              <NoticesCard
                category={NOTICE_CATEGORY_LABELS[notice.category]}
                date={formatNoticeDate(notice.createdAt)}
                hasThumbnail={Boolean(notice.thumbnailUrl)}
                isPinned={notice.pinned}
                thumbnailUrl={notice.thumbnailUrl}
                title={notice.title}
              />
            </Link>
          ),
        }));
      case "feedbacks":
        return entries.items.map((feedback) => ({
          id: feedback.feedbackId,
          // 답변이 있는 피드백만 상세(모아보기)가 있다 — 열린피드백 목록과 같은 규칙. 서버는 답변이 공개된 것만 찾아 준다
          node: hasFeedbackAnswer(feedback) ? (
            <Link className="block" to={getFeedbackPath(feedback.feedbackId)}>
              <FeedbacksCard
                question={feedback.question}
                round={formatFeedbackRound(feedback.round)}
              />
            </Link>
          ) : (
            <FeedbacksCard
              question={feedback.question}
              round={formatFeedbackRound(feedback.round)}
            />
          ),
        }));
      case "archives":
        return entries.items.map((archive) => ({
          id: archive.archiveId,
          node: (
            <Link
              className="block"
              to={`/archives/${archive.archiveId}`}
              viewTransition
            >
              <SearchArchivingCard
                date={formatDate(archive.startDate)}
                thumbnailUrl={archive.thumbnailUrl}
                title={archive.title}
              />
            </Link>
          ),
        }));
      case "billilge":
        return entries.items.map((item) => ({
          id: item.itemId,
          node: (
            <div className="px-5">
              <BillilgeItemCard
                bordered
                // 대여 바텀시트는 빌릴게 화면 안의 상태라 검색에서는 빌릴게 화면으로 보낸다.
                icon={item.imageUrl}
                itemName={item.name}
                onRentRequest={() => navigate("/billilge")}
                subtitle={`수량 ${item.count}`}
              />
            </div>
          ),
        }));
    }
  };

  const { gapClassName, hasDivider } = LIST_STYLE[entries.category];

  return (
    <div className={`flex flex-col ${gapClassName}`}>
      {buildEntries().map((entry, index) => (
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
