import {
  Divider,
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsCard from "@/features/events/components/EventsCard";
import EventsEmptyState from "@/features/events/components/EventsEmptyState";
import {
  EVENT_STATUS_FILTERS,
  EVENTS,
} from "@/features/events/constants/events";

// Figma: 행사 모집중 empty (nodeId 1165:62713)는 "모집중" 필터 버전만 준다 —
// 일러스트·레이아웃·"아카이빙 둘러보기" 버튼이 이 조합의 스펙이다.
// 나머지 필터 문구는 디자인에 없어서 같은 톤으로 맞춰 쓴 것이고, 확정 문구가 나오면 교체한다.
// 버튼은 Figma가 지정한 모집중에만 노출한다 — 모집종료 필터에서 "지난 행사를 보세요"는 모순이 된다.
const EMPTY_STATE_BY_FILTER: Record<
  string,
  { title: string; description: string; actionLabel?: string }
> = {
  all: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "등록된 행사가 없어요",
  },
  closed: {
    description: "종료된 행사가 아직 없어요",
    title: "지난 행사가 없어요",
  },
  open: {
    actionLabel: "아카이빙 둘러보기",
    description: "지난 행사의 활동을 확인해 보세요",
    title: "모집 중인 행사가 없어요",
  },
  upcoming: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "모집 예정인 행사가 없어요",
  },
};

// Figma: 행사 (nodeId 1243:70854)
function EventsListScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("event");
  const [statusFilter, setStatusFilter] = useState("all");

  // 행사/신청내역 토글은 Figma에서 Top Navigation 인스턴스 안(타이틀 행 아래)에 있어서
  // ScreenHeader의 toolbar 슬롯으로 넘긴다 — WDS TopNavigation이 원래 갖고 있는 슬롯이다.
  useScreenHeader(
    <ScreenHeader
      title="행사"
      toolbar={
        // Figma Tool 프레임(56~88)은 높이 32에 아래 여백이 없다 — 세로 패딩을 주면 헤더가 그만큼 길어진다
        <div className="px-5">
          <SegmentedControl onValueChange={setTab} size="small" value={tab}>
            <SegmentedControlItem value="event">행사</SegmentedControlItem>
            <SegmentedControlItem value="application">
              신청내역
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
      }
      trailing={
        <>
          <TopNavigationButton aria-label="검색" variant="icon">
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  // 빌릴게 카테고리 필터와 달리 모집 상태는 목데이터에 이미 들어있어서 실제로 걸러낼 수 있다.
  const visibleEvents =
    statusFilter === "all"
      ? EVENTS
      : EVENTS.filter((event) => event.status === statusFilter);

  return (
    <>
      {/* 필터는 고정하고 목록만 스크롤된다 */}
      <div className="shrink-0 px-5 pt-4 pb-6">
        <FilterChipGroup
          onChange={setStatusFilter}
          options={EVENT_STATUS_FILTERS}
          value={statusFilter}
        />
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "event" && visibleEvents.length === 0 ? (
          // Figma는 Empty State를 목록 영역(헤더·Bottom Nav 사이) 가운데에 둔다.
          // 카드 목록과 같은 gap-6 래퍼 안에 넣으면 flex-1이 높이를 못 받아 위에 붙어버려서,
          // 빈 목록일 때는 래퍼를 대체해 h-full로 가운데 정렬한다.
          <div className="flex h-full items-center justify-center">
            <EventsEmptyState
              {...(EMPTY_STATE_BY_FILTER[statusFilter] ??
                EMPTY_STATE_BY_FILTER.all)}
            />
          </div>
        ) : tab === "event" ? (
          <div className="flex flex-col gap-6 pb-4">
            {visibleEvents.map((event, index) => (
              <Fragment key={event.id}>
                {index > 0 && (
                  <div className="px-5">
                    <Divider color="semantic.line.normal.alternative" />
                  </div>
                )}
                <EventsCard
                  actionLabel={event.actionLabel}
                  eventDate={event.eventDate}
                  onApply={() => navigate(`/events/${event.id}/apply`)}
                  onSelect={() => navigate(`/events/${event.id}`)}
                  status={event.status}
                  statusLabel={event.statusLabel}
                  title={event.title}
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Typography
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              신청내역은 아직 준비 중이에요
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}

export default EventsListScreen;
