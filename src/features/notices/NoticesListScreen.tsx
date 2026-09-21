import {
  Divider,
  Tab,
  TabList,
  TabListItem,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import NoticesCard from "@/features/notices/components/NoticesCard";
import {
  NOTICES,
  type NoticeCategory,
} from "@/features/notices/constants/notices";

type NoticeTab = "all" | "general" | "partnership";

const TAB_CATEGORY: Record<NoticeTab, NoticeCategory | "all"> = {
  all: "all",
  general: "일반",
  partnership: "제휴",
};

// Figma: 게시판 - 공지 (nodeId 1256:81776), 탭 선택 시 (nodeId 1256:81812)
function NoticesListScreen() {
  const [tab, setTab] = useState<NoticeTab>("all");

  // "공지"/"열린피드백" 2단 타이틀(Figma "Board Title")은 ScreenHeader의 토글 타이틀로 표현한다.
  // 열린피드백 게시판(코드 용어 feedbacks, terminology.md)은 이번 범위 밖이라 onChange 없이
  // 비활성 텍스트로만 둔다.
  useScreenHeader(
    <ScreenHeader
      title={{ activeIndex: 0, options: ["공지", "열린피드백"] }}
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

  const notices = NOTICES.filter(
    (notice) => tab === "all" || notice.category === TAB_CATEGORY[tab],
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
        <div className="flex flex-col gap-4 py-4">
          {notices.map((notice, index) => (
            <Fragment key={notice.id}>
              {index > 0 && (
                <div className="px-5">
                  <Divider color="semantic.line.normal.alternative" />
                </div>
              )}
              <NoticesCard
                category={notice.category}
                date={notice.date}
                hasThumbnail={notice.hasThumbnail}
                isPinned={notice.isPinned}
                title={notice.title}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default NoticesListScreen;
