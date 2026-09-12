import {
  Divider,
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventCard from "@/features/events/components/EventCard";
import {
  EVENT_STATUS_FILTERS,
  EVENTS,
} from "@/features/events/constants/events";

// Figma: 행사 (nodeId 1243:70854)
function EventListScreen() {
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
    <div className="flex h-full flex-col">
      {/* 필터는 고정하고 목록만 스크롤된다 */}
      <div className="shrink-0 px-5 pt-4 pb-6">
        <FilterChipGroup
          onChange={setStatusFilter}
          options={EVENT_STATUS_FILTERS}
          value={statusFilter}
        />
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "event" ? (
          <div className="flex flex-col gap-6 pb-4">
            {visibleEvents.map((event, index) => (
              <Fragment key={event.id}>
                {index > 0 && (
                  <div className="px-5">
                    <Divider color="semantic.line.normal.alternative" />
                  </div>
                )}
                <EventCard
                  actionLabel={event.actionLabel}
                  eventDate={event.eventDate}
                  status={event.status}
                  statusLabel={event.statusLabel}
                  title={event.title}
                />
              </Fragment>
            ))}
            {visibleEvents.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <Typography
                  color="semantic.label.alternative"
                  variant="label2"
                  weight="regular"
                >
                  해당하는 행사가 없어요
                </Typography>
              </div>
            )}
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
    </div>
  );
}

export default EventListScreen;
