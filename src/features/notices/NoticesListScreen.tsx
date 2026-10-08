import { Tab, TabList, TabListItem, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import type { NoticeCategory } from "@/entities/notices/types";
import NoticesList from "@/features/notices/components/NoticesList";
import NoticesListSkeleton from "@/features/notices/components/NoticesListSkeleton";
import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/notifications";
import { getSearchPath } from "@/features/search/constants/search";

type NoticeTab = "all" | "general" | "partnership";

const TAB_CATEGORY: Record<NoticeTab, NoticeCategory | "all"> = {
  all: "all",
  general: "일반",
  partnership: "제휴",
};

// Figma: 게시판 - 공지 (nodeId 1256:81776), 탭 선택 시 (nodeId 1256:81812)
function NoticesListScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NoticeTab>("all");

  // "공지"/"열린피드백" 2단 타이틀(Figma "Board Title")은 ScreenHeader의 토글 타이틀로 표현한다.
  // 열린피드백 게시판(코드 용어 feedbacks, terminology.md) 화면이 생겨서 이제 클릭하면 실제로
  // 이동한다(게시판-열린피드백 화면 쪽도 동일하게 연결).
  useScreenHeader(
    <ScreenHeader
      title={{
        activeIndex: 0,
        onChange: (index) => navigate(index === 0 ? "/notices" : "/feedbacks"),
        options: ["공지", "열린피드백"],
      }}
      trailing={
        <>
          <TopNavigationButton
            aria-label="검색"
            onClick={() => navigate(getSearchPath("notices"))}
            variant="icon"
          >
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton
            aria-label="알림"
            onClick={() =>
              navigate(NOTIFICATIONS_PATH, { viewTransition: true })
            }
            variant="icon"
          >
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  return (
    <>
      {/* 전체/일반 공지/제휴 공지 탭은 Figma에서 타이틀 행 아래("Tool" 영역)에 붙지만,
          헤더가 아니라 화면이 직접 본문 최상단에 그린다(행사·빌릴게 화면과 같은 구조).
          목록만 스크롤되도록 여기는 고정(shrink-0)하고, Tool 영역은 위아래 여백이 없다. */}
      <div className="shrink-0 px-5">
        <Tab onValueChange={(value) => setTab(value as NoticeTab)} value={tab}>
          <TabList>
            <TabListItem value="all">전체</TabListItem>
            <TabListItem value="general">일반 공지</TabListItem>
            <TabListItem value="partnership">제휴 공지</TabListItem>
          </TabList>
        </Tab>
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {/* 헤더·탭은 데이터와 무관해서 바로 그리고, 데이터를 받는 목록 자리만 스켈레톤으로 채운다 */}
        <Suspense fallback={<NoticesListSkeleton />}>
          <NoticesList category={TAB_CATEGORY[tab]} />
        </Suspense>
      </div>
    </>
  );
}

export default NoticesListScreen;
