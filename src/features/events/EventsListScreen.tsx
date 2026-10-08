import {
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsList from "@/features/events/components/EventsList";
import EventsListSkeleton from "@/features/events/components/EventsListSkeleton";
import { EVENT_STATUS_FILTERS } from "@/features/events/constants/events";
import { getSearchPath } from "@/features/search/constants/search";

// Figma: 행사 (nodeId 1243:70854)
function EventsListScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("event");
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
        <SegmentedControl onValueChange={setTab} size="small" value={tab}>
          <SegmentedControlItem value="event">행사</SegmentedControlItem>
          <SegmentedControlItem value="application">
            신청내역
          </SegmentedControlItem>
        </SegmentedControl>
      </div>

      {/* 필터는 고정하고 목록만 스크롤된다 */}
      <div className="shrink-0 px-5 pt-4 pb-6">
        <FilterChipGroup
          onChange={setStatusFilter}
          options={EVENT_STATUS_FILTERS}
          value={statusFilter}
        />
      </div>

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
