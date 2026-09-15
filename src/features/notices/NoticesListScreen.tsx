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
      toolbar={
        // 탭 전체/일반 공지/제휴 공지는 Figma에서 Top Navigation 인스턴스 안(타이틀 행 아래)에
        // 있어서 ScreenHeader의 toolbar 슬롯으로 넘긴다(행사 화면 세그먼트 토글과 같은 이유).
        <div className="px-5">
          <Tab
            onValueChange={(value) => setTab(value as NoticeTab)}
            value={tab}
          >
            <TabList>
              <TabListItem value="all">전체</TabListItem>
              <TabListItem value="general">일반 공지</TabListItem>
              <TabListItem value="partnership">제휴 공지</TabListItem>
            </TabList>
          </Tab>
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

  const notices = NOTICES.filter(
    (notice) => tab === "all" || notice.category === TAB_CATEGORY[tab],
  );

  return (
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
  );
}

export default NoticesListScreen;
