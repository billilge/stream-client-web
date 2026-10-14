import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { NOTIFICATIONS_SETTINGS_PATH } from "@/features/notifications/constants/notifications";
import SettingsAccountRows from "@/features/settings/components/SettingsAccountRows";
import SettingsAccountRowsSkeleton from "@/features/settings/components/SettingsAccountRowsSkeleton";
import SettingsAppVersionRow from "@/features/settings/components/SettingsAppVersionRow";
import SettingsAppVersionRowSkeleton from "@/features/settings/components/SettingsAppVersionRowSkeleton";
import SettingsRow from "@/features/settings/components/SettingsRow";
import SettingsSection from "@/features/settings/components/SettingsSection";
import {
  SETTINGS_EXTERNAL_LINKS,
  SETTINGS_PATHS,
} from "@/features/settings/constants/settings";
import { useAccountExit } from "@/features/settings/hooks/useAccountExit";

// Figma: 설정 (nodeId 3524:152322) — 계정 정보 / 알림 설정 / 서비스 정보 / 로그아웃 네 장의 흰
// 카드가 회색 배경 위에 8px 간격으로 쌓이고, 맨 아래에 Copyright가 깔린다.
//
// 의견 보내기·개인정보 처리방침은 화면을 따로 만들지 않고 구글폼으로 연결한다. 폼 주소가 아직
// 없어서(SETTINGS_EXTERNAL_LINKS가 빈 문자열) 그동안은 두 행을 비활성으로 그린다 — 누를 수
// 있어 보이는데 반응이 없는 상태를 피한다. 주소를 상수에 채우면 저절로 활성으로 돌아온다.
// Figma에는 이 비활성 상태가 없다(디자인에는 주소가 있다고 보고 그려져 있다).
// 로그아웃은 확인 모달(3524:152426)을 공용 ConfirmModal(tone="negative")로 붙였고,
// 회원 탈퇴는 별도 화면(3524:152473)으로 이동한다.
//
// "알림 설정"은 알림 화면이 이미 가진 화면으로 보낸다 — Figma가 설정 섹션(3524:152367)과 알림
// 섹션(3628:110837)에 같은 화면을 복제해 뒀을 뿐, 진입점만 둘이고 화면은 하나다.
function SettingsScreen() {
  const navigate = useNavigate();
  const exitAccount = useAccountExit();
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 설정 아래로 화면을 쌓는 이동이라 슬라이드를 켠다(coding-style.md의 화면 전환 규칙).
  const pushScreen = (to: string) => navigate(to, { viewTransition: true });

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
      title="설정"
      variant="normal"
    />,
  );

  // 주소가 비어 있으면 행이 비활성이라 여기까지 오지 않는다 — 열 수 있을 때만 새 탭으로 띄운다.
  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="scrollbar-hidden flex h-full flex-col overflow-y-auto px-5 pb-5">
      <div className="flex flex-col gap-2">
        <SettingsSection title="계정 정보">
          <Suspense fallback={<SettingsAccountRowsSkeleton />}>
            <SettingsAccountRows
              onChangePhone={() => pushScreen(SETTINGS_PATHS.phoneChange)}
            />
          </Suspense>
        </SettingsSection>

        <SettingsSection>
          <SettingsRow
            label="알림 설정"
            onClick={() => pushScreen(NOTIFICATIONS_SETTINGS_PATH)}
          />
        </SettingsSection>

        <SettingsSection title="서비스 정보">
          <SettingsRow
            disabled={!SETTINGS_EXTERNAL_LINKS.feedbackForm}
            label="의견 보내기"
            onClick={() =>
              openExternalLink(SETTINGS_EXTERNAL_LINKS.feedbackForm)
            }
          />
          <SettingsRow
            disabled={!SETTINGS_EXTERNAL_LINKS.privacyPolicy}
            label="개인정보 처리방침"
            onClick={() =>
              openExternalLink(SETTINGS_EXTERNAL_LINKS.privacyPolicy)
            }
          />
          <Suspense fallback={<SettingsAppVersionRowSkeleton />}>
            <SettingsAppVersionRow />
          </Suspense>
        </SettingsSection>

        <SettingsSection rowGap="compact">
          <SettingsRow
            label="로그아웃"
            onClick={() => setLogoutOpen(true)}
            tone="alternative"
          />
          <SettingsRow
            label="회원 탈퇴"
            onClick={() => pushScreen(SETTINGS_PATHS.withdrawal)}
            tone="negative"
          />
        </SettingsSection>
      </div>

      {/* Copyright는 카드 묶음 아래 남는 공간 맨 끝에 붙는다(Figma 3524:152366) */}
      <Typography
        align="center"
        as="p"
        className="mt-auto pt-6"
        color="semantic.label.disable"
        variant="caption1"
        weight="regular"
      >
        © 2026 stream
      </Typography>

      <ConfirmModal
        cancelLabel="취소"
        confirmLabel="로그아웃"
        onCancel={() => setLogoutOpen(false)}
        // 로그아웃하면 돌아올 화면이 아니라 설정을 히스토리에서 치우고 나간다.
        // 실제 세션 정리는 인증이 붙을 때 여기에 함께 붙인다(ACCOUNT_EXIT_PATH 주석 참고).
        onConfirm={() => {
          setLogoutOpen(false);
          exitAccount();
        }}
        open={logoutOpen}
        title="정말 로그아웃할까요?"
        tone="negative"
      />
    </div>
  );
}

export default SettingsScreen;
