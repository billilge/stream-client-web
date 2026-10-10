import {
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsApplicationList from "@/features/events/components/EventsApplicationList";
import EventsApplicationListSkeleton from "@/features/events/components/EventsApplicationListSkeleton";
import EventsList from "@/features/events/components/EventsList";
import EventsListSkeleton from "@/features/events/components/EventsListSkeleton";
import {
  EVENT_STATUS_FILTERS,
  EVENTS_TAB_PATHS,
  type EventsTab,
} from "@/features/events/constants/events";
import { getSearchPath } from "@/features/search/constants/search";

// Figma: 행사 (nodeId 1243:70854)
function EventsListScreen() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tab: EventsTab =
    pathname === EVENTS_TAB_PATHS.application ? "application" : "event";
  const [statusFilter, setStatusFilter] = useState("all");

  useScreenHeader(
    <ScreenHeader
      title="행사"
      trailing={
        <>
          <TopNavigationButton
            aria-label="검색"
            onClick={() => navigate(getSearchPath("events"))}
            variant="icon"
          >
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  return (
    <>
      {/* 행사/신청내역 토글 + 필터는 화면마다 값·동작이 달라 헤더가 아니라 화면이 직접 그린다.
          목록만 스크롤되도록 여기는 고정(shrink-0)한다(빌릴게 화면과 같은 구조).
          Figma Tool 프레임(56~88)은 높이 32에 위아래 여백이 없다 — 세로 패딩을 주면
          토글과 그 아래 필터 행이 함께 밀린다. */}
      <div className="shrink-0 px-5">
        <SegmentedControl
          // 탭을 바꿀 때마다 히스토리가 쌓이지 않게 replace로 바꾼다
          onValueChange={(value) =>
            navigate(EVENTS_TAB_PATHS[value as EventsTab], { replace: true })
          }
          size="small"
          value={tab}
        >
          <SegmentedControlItem value="event">행사</SegmentedControlItem>
          <SegmentedControlItem value="application">
            신청내역
          </SegmentedControlItem>
        </SegmentedControl>
      </div>

      {/* 필터는 고정하고 목록만 스크롤된다. 신청내역 탭은 Figma(1133:46168)에 필터 행이 없다 */}
      {tab === "event" && (
        <div className="shrink-0 px-5 pt-4 pb-6">
          <FilterChipGroup
            onChange={setStatusFilter}
            options={EVENT_STATUS_FILTERS}
            value={statusFilter}
          />
        </div>
      )}

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {/* 헤더·토글·필터는 데이터와 무관해서 바로 그리고, 데이터를 받는 목록 자리만 스켈레톤으로 채운다 */}
        {tab === "event" ? (
          <Suspense fallback={<EventsListSkeleton />}>
            <EventsList
              onApply={(eventId) =>
                navigate(`/events/${eventId}/apply`, { viewTransition: true })
              }
              onSelect={(eventId) =>
                navigate(`/events/${eventId}`, { viewTransition: true })
              }
              statusFilter={statusFilter}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<EventsApplicationListSkeleton />}>
            <EventsApplicationList
              // 행사 탭은 같은 화면의 형제 탭이라 슬라이드 없이 바꾼다
              onBrowseEvents={() =>
                navigate(EVENTS_TAB_PATHS.event, { replace: true })
              }
              onSelectApplication={(applicationId) =>
                navigate(`${EVENTS_TAB_PATHS.application}/${applicationId}`, {
                  viewTransition: true,
                })
              }
              onSelectEvent={(eventId) =>
                navigate(`/events/${eventId}`, { viewTransition: true })
              }
            />
          </Suspense>
        )}
      </div>
    </>
  );
}

export default EventsListScreen;
