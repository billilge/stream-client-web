import {
  SegmentedControl,
  SegmentedControlItem,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft, IconSetting } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { HOME_PATH } from "@/features/home/constants/home";
import NotificationsAdminList from "@/features/notifications/components/NotificationsAdminList";
import NotificationsList from "@/features/notifications/components/NotificationsList";
import NotificationsListSkeleton from "@/features/notifications/components/NotificationsListSkeleton";
import {
  NOTIFICATIONS_PATH,
  NOTIFICATIONS_SETTINGS_PATH,
  NOTIFICATIONS_TAB_PATHS,
  type NotificationsTab,
} from "@/features/notifications/constants/notifications";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { hasAdminRole } from "@/shared/api";

interface NotificationsScreenProps {
  /** 내 알림/관리자 알림 탭 — 탭마다 경로가 달라서 라우터가 정해 넘긴다 */
  tab: NotificationsTab;
}

// Figma: 알림 (nodeId 3595:107100), 알림 empty state (3595:107112)
// 홈·행사·게시판·빌릴게 헤더의 알림 아이콘이 이 화면으로 보낸다. 헤더는 데이터와 상관없어 바로 그리고,
// 목록 영역만 Suspense로 감싼다.
// 관리자 알림 탭은 Figma 시안이 없어서 빌릴게·행사 화면의 Tool 영역(WDS Segmented Control small)을 그대로
// 따랐다. 두 목록은 서버에서 커서를 따로 넘기는 별개 알림함이라, 한 스크롤에 섹션으로 쌓지 않고 토글로 나눈다.
function NotificationsScreen({ tab }: NotificationsScreenProps) {
  const navigate = useNavigate();

  const goBack = useBackNavigation(HOME_PATH);
  // 로그인 토큰의 역할로 정한다 — 이 화면은 로그인해야 들어오고, 토큰이 사라지면 가드가 로그인으로 보낸다
  const isAdmin = hasAdminRole();

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="알림"
      trailing={
        <TopNavigationButton
          aria-label="알림 설정"
          onClick={() =>
            navigate(NOTIFICATIONS_SETTINGS_PATH, { viewTransition: true })
          }
          variant="icon"
        >
          <IconSetting />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  // 관리자가 아니면 토글을 그리지 않고, 관리자 탭 경로로 들어와도 내 알림으로 돌린다
  if (tab === "admin" && !isAdmin) {
    return <Navigate replace to={NOTIFICATIONS_PATH} />;
  }

  return (
    <>
      {isAdmin && (
        // 목록만 스크롤되도록 고정(shrink-0)한다. 바로 아래 안 읽은 알림의 파란 배경이 토글에 붙지 않게 8px 띄운다
        <div className="shrink-0 px-5 pb-2">
          <SegmentedControl
            // 탭을 바꿀 때마다 히스토리가 쌓이지 않게 replace로 바꾼다
            onValueChange={(value) =>
              navigate(NOTIFICATIONS_TAB_PATHS[value as NotificationsTab], {
                replace: true,
              })
            }
            size="small"
            value={tab}
          >
            <SegmentedControlItem value="mine">내 알림</SegmentedControlItem>
            <SegmentedControlItem value="admin">
              관리자 알림
            </SegmentedControlItem>
          </SegmentedControl>
        </div>
      )}

      {/* 탭 전환은 라우터 이동(transition)이라 같은 경계면 새 탭 데이터를 받는 동안 이전 탭을 붙잡는다 —
          key로 탭마다 다른 경계로 둔다(행사 목록과 같은 이유). 읽음 state도 탭마다 따로 시작한다. */}
      <Suspense fallback={<NotificationsListSkeleton />} key={tab}>
        {tab === "admin" ? <NotificationsAdminList /> : <NotificationsList />}
      </Suspense>
    </>
  );
}

export default NotificationsScreen;
