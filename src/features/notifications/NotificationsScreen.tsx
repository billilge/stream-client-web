import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSetting } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { HOME_PATH } from "@/features/home/constants/home";
import NotificationsList from "@/features/notifications/components/NotificationsList";
import NotificationsListSkeleton from "@/features/notifications/components/NotificationsListSkeleton";
import { NOTIFICATIONS_SETTINGS_PATH } from "@/features/notifications/constants/notifications";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// Figma: 알림 (nodeId 3595:107100), 알림 empty state (3595:107112)
// 홈·행사·게시판·빌릴게 헤더의 알림 아이콘이 이 화면으로 보낸다. 헤더는 데이터와 상관없어 바로 그리고,
// 목록 영역만 Suspense로 감싼다.
function NotificationsScreen() {
  const navigate = useNavigate();

  const goBack = useBackNavigation(HOME_PATH);

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

  return (
    <Suspense fallback={<NotificationsListSkeleton />}>
      <NotificationsList />
    </Suspense>
  );
}

export default NotificationsScreen;
