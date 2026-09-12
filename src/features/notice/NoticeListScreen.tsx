import {
  Tab,
  TabList,
  TabListItem,
  TopNavigation,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { BottomNavValue } from "@/components/ui/BottomNav";
import ScreenLayout from "@/components/ui/ScreenLayout";
import NoticeCard from "@/features/notice/components/NoticeCard";
import {
  NOTICES,
  type NoticeCategory,
} from "@/features/notice/constants/notices";

type NoticeTab = "all" | "general" | "partnership";

const TAB_CATEGORY: Record<NoticeTab, NoticeCategory | "all"> = {
  all: "all",
  general: "일반",
  partnership: "제휴",
};

// Figma: 게시판 - 공지 (nodeId 1256:81776), 탭 선택 시 (nodeId 1256:81812)
function NoticeListScreen() {
  const [tab, setTab] = useState<NoticeTab>("all");
  const [bottomNavValue, setBottomNavValue] = useState<BottomNavValue>("board");
  const navigate = useNavigate();

  const handleBottomNavValueChange = (value: BottomNavValue) => {
    setBottomNavValue(value);
    if (value === "home") {
      navigate("/");
    } else if (value === "rental") {
      navigate("/rental");
    }
  };

  const notices = NOTICES.filter(
    (notice) => tab === "all" || notice.category === TAB_CATEGORY[tab],
  );

  return (
    <ScreenLayout
      bottomNavValue={bottomNavValue}
      header={
        <TopNavigation
          background={false}
          toolbar={
            <Tab
              onValueChange={(value) => setTab(value as NoticeTab)}
              value={tab}
            >
              <TabList horizontalPadding>
                <TabListItem value="all">전체</TabListItem>
                <TabListItem value="general">일반 공지</TabListItem>
                <TabListItem value="partnership">제휴 공지</TabListItem>
              </TabList>
            </Tab>
          }
          trailingContent={
            <>
              <TopNavigationButton aria-label="검색" variant="icon">
                <IconSearch />
              </TopNavigationButton>
              <TopNavigationButton aria-label="알림" variant="icon">
                <IconBell />
              </TopNavigationButton>
            </>
          }
          variant="display"
        >
          {/* 열린피드백 게시판 전환은 이번 범위 밖이라 비활성 텍스트로만 표시 */}
          <span className="flex items-center gap-2">
            <span className="text-label-strong">공지</span>
            <span className="text-label-disable">열린피드백</span>
          </span>
        </TopNavigation>
      }
      onBottomNavValueChange={handleBottomNavValueChange}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        {notices.map((notice, index) => (
          <Fragment key={notice.id}>
            <NoticeCard
              category={notice.category}
              date={notice.date}
              hasThumbnail={notice.hasThumbnail}
              isPinned={notice.isPinned}
              title={notice.title}
            />
            {index < notices.length - 1 && (
              <div className="w-full px-5">
                <div className="h-px w-full bg-line-normal-alternative" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </ScreenLayout>
  );
}

export default NoticeListScreen;
