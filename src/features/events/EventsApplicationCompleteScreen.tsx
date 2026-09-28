import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsCompleteCheck from "@/features/events/components/EventsCompleteCheck";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import { EVENTS_APPLICATION } from "@/features/events/constants/eventsApplication";

// 신청내역 화면은 아직 없다 — 라우트가 없어서 준비 중 화면(ComingSoonScreen)이 뜬다.
const APPLICATION_HISTORY_PATH = "/my/applications";

// Figma: 행사 신청 완료 페이지 (nodeId 1712:192283)
// 행사 정보는 신청 폼과 마찬가지로 API 연동 전까지 목업 하나를 보여준다.
function EventsApplicationCompleteScreen() {
  const navigate = useNavigate();
  const { eventName, dateTime, location } = EVENTS_APPLICATION;

  useScreenHeader(
    <ScreenHeader
      trailing={
        // 신청이 끝난 화면이라 닫으면 폼으로 돌아가지 않고 홈으로 나간다
        <TopNavigationButton
          aria-label="닫기"
          onClick={() => navigate("/")}
          variant="icon"
        >
          <IconClose />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-6 px-5 pt-[104px]">
        <div className="flex flex-col items-center gap-2">
          <EventsCompleteCheck />
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="heading1"
              weight="bold"
            >
              신청이 완료됐어요
            </Typography>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label1"
              weight="regular"
            >
              신청해 주셔서 감사해요. 행사날 뵐게요!
            </Typography>
          </div>
        </div>
        <EventsSummaryCard
          dateTime={dateTime}
          eventName={eventName}
          location={location}
          tone="alternative"
        />
      </div>

      <div className="shrink-0">
        {/* variant="neutral" — 버튼 둘을 가로로 12px 간격에 반반씩 두는 Figma Action Area와 같다.
            WDS는 버튼 세로 padding을 12px(48px)로 주는데 Figma Main Action은 16px(56px)이라 맞춘다. */}
        <ActionArea variant="neutral">
          <ActionAreaButton
            buttonColor="assistive"
            buttonVariant="solid"
            onClick={() => navigate(APPLICATION_HISTORY_PATH)}
            sx={{ padding: "16px 28px" }}
            variant="alternative"
          >
            신청내역 보기
          </ActionAreaButton>
          <ActionAreaButton
            onClick={() => navigate("/")}
            sx={{ padding: "16px 28px" }}
          >
            홈으로 가기
          </ActionAreaButton>
        </ActionArea>
        {/* 신청 폼과 같은 이유의 14px — WDS ActionArea의 아래 padding 20px에 iOS Home Bar 여백을 더해 34px.
            앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 남긴다. */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default EventsApplicationCompleteScreen;
