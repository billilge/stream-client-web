import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import NotificationsSettingRow from "@/features/notifications/components/NotificationsSettingRow";
import {
  INITIAL_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS,
  NOTIFICATIONS_PATH,
  type NotificationSettingKey,
} from "@/features/notifications/constants/notifications";

// Figma: 알림 설정 (nodeId 3628:110837)
// 스위치 상태는 서버 API가 없어서 이 화면 state로만 들고 있다(새로고침하면 초기값으로 돌아간다).
// "전체 알림"은 따로 값을 두지 않고 카테고리가 모두 켜졌는지로 파생한다 — 누르면 전부 같은 값으로 맞춘다.
function NotificationsSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(INITIAL_NOTIFICATION_SETTINGS);

  const isAllEnabled = NOTIFICATION_SETTINGS.every(({ key }) => settings[key]);

  const setAll = (enabled: boolean) => {
    setSettings({
      bililge: enabled,
      board: enabled,
      events: enabled,
      lockers: enabled,
    });
  };

  const setOne = (key: NotificationSettingKey, enabled: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: enabled }));
  };

  // 알림 목록을 거치지 않고 바로 들어오면(딥링크) 뒤로 갈 히스토리가 없어 알림 목록으로 보낸다.
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(NOTIFICATIONS_PATH, { replace: true });
  };

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
      title="알림 설정"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto">
      <NotificationsSettingRow
        checked={isAllEnabled}
        label="전체 알림"
        onCheckedChange={setAll}
      />
      <div className="h-2 w-full shrink-0 bg-background-alternative" />
      <div className="flex flex-col gap-5 pb-6">
        {NOTIFICATION_SETTINGS.map(({ key, label, description }) => (
          <NotificationsSettingRow
            checked={settings[key]}
            description={description}
            key={key}
            label={label}
            onCheckedChange={(enabled) => setOne(key, enabled)}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationsSettingsScreen;
