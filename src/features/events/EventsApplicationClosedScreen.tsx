import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import applicationClosed from "@/assets/icons/events/application-closed.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// Figma: 행사 신청 중 마감됨 (nodeId 1133:43431)
// 제출하는 사이에 인원이 다 찬 경우다 — 신청 결과 화면이라 신청서로는 돌아가지 않는다.
function EventsApplicationClosedScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      trailing={
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
      <div className="flex flex-col items-center gap-4 px-5 pt-[104px]">
        <img
          alt=""
          className="h-[72.317px] w-[62.963px]"
          src={applicationClosed}
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="heading1"
            weight="bold"
          >
            신청 인원이 모두 찼어요
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label1"
            weight="regular"
          >
            다음 행사에서 만나요!
          </Typography>
        </div>
      </div>

      <div className="shrink-0">
        {/* 버튼 하나 짜리 Action Area — 신청 폼과 같은 이유로 세로 padding만 Figma(16px, 56px)에 맞춘다 */}
        <ActionArea>
          <ActionAreaButton
            onClick={() => navigate("/")}
            sx={{ paddingBlock: "16px" }}
          >
            홈으로 가기
          </ActionAreaButton>
        </ActionArea>
        {/* WDS ActionArea의 아래 padding 20px + 여기 14px = Figma Bottom Safe Area 34px.
            앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 남긴다. */}
        <div className="hidden h-[14px] bg-background-normal sm:block" />
      </div>
    </div>
  );
}

export default EventsApplicationClosedScreen;
