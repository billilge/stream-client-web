import {
  ActionArea,
  ActionAreaButton,
  Divider,
  PageCounter,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { type UIEvent, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EventsEmptyState from "@/features/events/components/EventsEmptyState";
import EventsStatusBadge from "@/features/events/components/EventsStatusBadge";
import { EVENTS } from "@/features/events/constants/events";

// Figma: 행사 상세 (nodeId 1133:42433 모집중 / 1156:53992 모집예정)
//
// 헤더를 useScreenHeader로 등록하지 않는다 — Figma는 뒤로가기 버튼이 Hero 이미지 위에 떠 있는
// 오버레이인데 ScreenLayout의 헤더 슬롯은 본문 위에 자리를 차지하는 구조라 그대로는 못 맞춘다.
// 훅을 호출하지 않으면 슬롯이 null(0px)로 남아서, Hero가 화면 최상단부터 시작한다.
// 공용 ScreenHeader에 overlay 옵션을 넣는 방안도 검토했지만 다른 화면에 영향이 가서 로컬로 뒀다.
//
// 상태별로 갈리는 건 뱃지와 하단 CTA뿐이다 — 모집중만 활성이고 나머지는 disabled에
// 목데이터의 actionLabel("8월 10일 오픈" / "모집종료")이 그대로 들어간다(목록 카드와 같은 규칙).
function EventsDetailScreen() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const event = EVENTS.find((item) => item.id === eventId);

  // 실 이미지 API 전까지는 장수만 알고 URL이 없어서, 슬라이드 key를 미리 만들어 둔다.
  // map 콜백의 index를 key로 쓰면 noArrayIndexKey에 걸린다.
  const imageKeys = useMemo(
    () =>
      Array.from(
        { length: event?.imageCount ?? 0 },
        (_, index) => `${event?.id}-image-${index}`,
      ),
    [event?.id, event?.imageCount],
  );

  if (!event) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EventsEmptyState
          description="목록에서 다시 선택해 주세요"
          title="행사를 찾을 수 없어요"
        />
      </div>
    );
  }

  const isOpen = event.status === "open";
  const hasMultipleImages = event.imageCount > 1;

  // 스크롤 위치로 현재 장을 역산한다. 한 장이 뷰포트 폭을 꽉 채우므로 offsetWidth로 나누면 인덱스가 된다.
  // scroll 이벤트마다 setState가 불리지만, 같은 값이면 React가 리렌더를 건너뛴다.
  const handleHeroScroll = (scrollEvent: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, offsetWidth } = scrollEvent.currentTarget;
    if (offsetWidth === 0) {
      return;
    }
    setCurrentPage(Math.round(scrollLeft / offsetWidth) + 1);
  };

  return (
    <>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {/* Hero — 실제 행사 이미지 API 전까지 Figma와 같은 단색 placeholder.
            Figma는 375×375 정사각이라 폭이 유동인 지금 레이아웃에서는 aspect-square로 둔다.
            이미지가 여러 장이면 가로 스크롤 스냅으로 한 장씩 넘긴다(브라우저 기본 스크롤이라
            터치·트랙패드·키보드가 모두 동작하고, 별도 캐러셀 라이브러리가 필요 없다). */}
        <div className="relative w-full">
          <div
            className="scrollbar-hidden flex w-full snap-x snap-mandatory overflow-x-auto"
            onScroll={hasMultipleImages ? handleHeroScroll : undefined}
          >
            {imageKeys.map((imageKey) => (
              <div
                className="aspect-square w-full shrink-0 snap-start bg-thumbnail-placeholder"
                key={imageKey}
              />
            ))}
          </div>

          {/* 뒤로가기·카운터는 스크롤되지 않게 스크롤 컨테이너 밖에 절대배치한다 */}
          <div className="absolute top-4 left-4 z-10">
            <TopNavigationButton
              aria-label="뒤로가기"
              onClick={() => navigate(-1)}
              variant="icon"
            >
              <IconChevronLeft />
            </TopNavigationButton>
          </div>
          {/* 한 장뿐이면 셀 게 없어서 카운터를 감춘다 */}
          {hasMultipleImages && (
            <div className="absolute right-5 bottom-5 z-10">
              <PageCounter
                currentPage={currentPage}
                size="small"
                totalPages={event.imageCount}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 px-5 pt-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-2">
              <EventsStatusBadge
                size="medium"
                status={event.status}
                statusLabel={event.statusLabel}
              />
              <Typography
                as="h1"
                color="semantic.label.normal"
                variant="heading2"
                weight="bold"
              >
                {event.title}
              </Typography>
            </div>

            {/* Figma는 라벨 칼럼(28px)과 값 칼럼을 gap 12로 나란히 두고, 각 칼럼 안은 gap 8이다 */}
            <div className="flex gap-3">
              <div className="flex shrink-0 flex-col gap-2">
                {["일시", "장소", "대상"].map((label) => (
                  <Typography
                    color="semantic.label.alternative"
                    key={label}
                    variant="label1"
                    weight="medium"
                  >
                    {label}
                  </Typography>
                ))}
              </div>
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <Typography
                  color="semantic.label.neutral"
                  variant="label1"
                  weight="medium"
                >
                  {event.schedule}
                </Typography>
                <Typography
                  color="semantic.label.neutral"
                  variant="label1"
                  weight="medium"
                >
                  {event.location}
                </Typography>
                {/* 대상만 여러 줄 — Figma도 한 값 안에서 줄을 나눠 놨다 */}
                <div className="flex flex-col">
                  {event.audience.map((line) => (
                    <Typography
                      color="semantic.label.neutral"
                      key={line}
                      variant="label1"
                      weight="medium"
                    >
                      {line}
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Divider color="semantic.line.normal.alternative" />

          {/* 본문은 Figma "Label 1/Reading - Regular"(14px, line-height 1.571) = label1-reading.
              목데이터가 줄바꿈을 그대로 들고 있어서 whitespace-pre-wrap으로 살린다. */}
          <Typography
            color="semantic.label.normal"
            sx={{ whiteSpace: "pre-wrap" }}
            variant="label1-reading"
            weight="regular"
          >
            {event.description}
          </Typography>
        </div>
      </div>

      <div className="shrink-0">
        <ActionArea background>
          {/* WDS ActionAreaButton은 항상 Button size="large"(padding 12px 28px → 48px)로 그리는데,
              Figma Main Action은 padding 16px 28px(56px)이라 세로 padding만 sx로 맞춘다. */}
          <ActionAreaButton
            disabled={!isOpen}
            onClick={() => navigate(`/events/${event.id}/apply`)}
            sx={{ paddingBlock: "16px" }}
          >
            {event.actionLabel}
          </ActionAreaButton>
        </ActionArea>
        {/* Figma Action Area(110px)는 버튼 아래가 iOS Home Bar 여백까지 합쳐 34px인데,
            WDS ActionArea는 아래 padding 20px만 준다 — 모자란 14px을 여기서 더한다.
            앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 남긴다(BottomNav와 같은 규칙). */}
        <div className="hidden h-[14px] bg-background-elevated-normal sm:block" />
      </div>
    </>
  );
}

export default EventsDetailScreen;
