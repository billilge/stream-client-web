import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import NotificationToggleRow from "@/features/settings/components/NotificationToggleRow";
import {
  NOTIFICATION_CATEGORIES,
  type NotificationCategoryId,
} from "@/features/settings/constants/settings";

// Figma 기본값: 전체 알림 off, 카테고리는 빌릴게만 on (3013:116191, 3013:116199)
const DEFAULT_CATEGORY_STATE: Record<NotificationCategoryId, boolean> = {
  bililge: true,
  board: false,
  events: false,
  lockers: false,
};

// Figma: 알림 설정 (nodeId 3013:116182) — 전체 알림 행, 8px 두꺼운 구분선, 카테고리 4개.
// 구분선은 Figma `Divider(new)`의 8px 버전이라 1px 헤어라인(WDS Divider)과 다른 패턴이다
// (wds-component-usage.md "Divider(new)의 8px 버전은 1px 구분선과 다른 별개 패턴" 참고).
//
// 전체 알림은 카테고리를 한 번에 켜고 끄는 마스터 스위치다. 그래서 자체 state를 따로 두지 않고
// "카테고리가 전부 켜져 있는가"로 계산한다 — 이러면 카테고리를 하나라도 끄는 순간 전체 알림도
// 같이 꺼져서 두 값이 어긋날 일이 없다. Figma 기본 상태(빌릴게만 on → 전체 알림 off)도 이
// 계산 결과와 그대로 맞는다. on/off 저장은 API 연동 전이라 화면 state로만 둔다.
function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const [categoryEnabled, setCategoryEnabled] = useState(
    DEFAULT_CATEGORY_STATE,
  );
  const allEnabled = NOTIFICATION_CATEGORIES.every(
    (category) => categoryEnabled[category.id],
  );

  const handleGlobalChange = (checked: boolean) => {
    setCategoryEnabled((prev) => {
      const next = { ...prev };
      for (const category of NOTIFICATION_CATEGORIES) {
        next[category.id] = checked;
      }
      return next;
    });
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
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
    <div className="scrollbar-hidden flex h-full flex-col gap-6 overflow-y-auto pt-2">
      <NotificationToggleRow
        checked={allEnabled}
        onCheckedChange={handleGlobalChange}
        title="전체 알림"
      />

      <div className="h-2 w-full shrink-0 bg-background-alternative" />

      <div className="flex flex-col gap-5">
        {NOTIFICATION_CATEGORIES.map((category) => (
          <NotificationToggleRow
            checked={categoryEnabled[category.id]}
            description={category.description}
            key={category.id}
            onCheckedChange={(checked) =>
              setCategoryEnabled((prev) => ({
                ...prev,
                [category.id]: checked,
              }))
            }
            title={category.title}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationSettingsScreen;
