import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import SettingsRow from "@/features/settings/components/SettingsRow";
import SettingsSection from "@/features/settings/components/SettingsSection";
import {
  APP_VERSION_LABEL,
  SETTINGS_ACCOUNT,
  SETTINGS_EXTERNAL_LINKS,
} from "@/features/settings/constants/settings";

// Figma: 설정 (nodeId 3013:116135) — 계정 정보 / 알림 설정 / 서비스 정보 / 로그아웃 네 장의 흰
// 카드가 회색 배경 위에 8px 간격으로 쌓이고, 맨 아래에 Copyright가 깔린다.
//
// 의견 보내기·개인정보 처리방침은 화면을 따로 만들지 않고 구글폼으로 연결한다(폼 주소가 아직
// 없어서 SETTINGS_EXTERNAL_LINKS가 빈 문자열이면 아무 동작도 하지 않는다).
// 로그아웃은 확인 모달(1799:87183)을 공용 ConfirmModal(tone="negative")로 붙였고,
// 회원 탈퇴는 별도 화면(3524:152473)으로 이동한다.
function SettingsScreen() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

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

  const openExternalLink = (url: string) => {
    if (!url) {
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="scrollbar-hidden flex h-full flex-col overflow-y-auto px-5 pb-5">
      <div className="flex flex-col gap-2">
        <SettingsSection title="계정 정보">
          <SettingsRow
            label="이름"
            value={SETTINGS_ACCOUNT.name}
            variant="account"
          />
          <SettingsRow
            label="이메일"
            value={SETTINGS_ACCOUNT.email}
            variant="account"
          />
          <SettingsRow
            label="전화번호"
            onClick={() => navigate("/settings/phone")}
            value={SETTINGS_ACCOUNT.phone}
            variant="account"
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow
            label="알림 설정"
            onClick={() => navigate("/settings/notifications")}
          />
        </SettingsSection>

        <SettingsSection title="서비스 정보">
          <SettingsRow
            label="의견 보내기"
            onClick={() =>
              openExternalLink(SETTINGS_EXTERNAL_LINKS.feedbackForm)
            }
          />
          <SettingsRow
            label="개인정보 처리방침"
            onClick={() =>
              openExternalLink(SETTINGS_EXTERNAL_LINKS.privacyPolicy)
            }
          />
          <SettingsRow label="앱 버전" value={APP_VERSION_LABEL} />
        </SettingsSection>

        <SettingsSection rowGap="compact">
          <SettingsRow
            label="로그아웃"
            onClick={() => setLogoutOpen(true)}
            tone="alternative"
          />
          <SettingsRow
            label="회원 탈퇴"
            onClick={() => navigate("/settings/withdraw")}
            tone="negative"
          />
        </SettingsSection>
      </div>

      {/* Copyright는 카드 묶음 아래 남는 공간 맨 끝에 붙는다(Figma 3013:116181) */}
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
        onConfirm={() => setLogoutOpen(false)}
        open={logoutOpen}
        title="정말 로그아웃할까요?"
        tone="negative"
      />
    </div>
  );
}

export default SettingsScreen;
