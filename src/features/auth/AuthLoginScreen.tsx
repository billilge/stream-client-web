import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenToast from "@/components/ui/ScreenToast";
import { loginWithKConnect } from "@/entities/auth/authApi";
import { markLoggedIn } from "@/entities/auth/session";
import AuthBrandHeader from "@/features/auth/components/AuthBrandHeader";
import AuthKConnectButton from "@/features/auth/components/AuthKConnectButton";
import AuthLoginCarousel from "@/features/auth/components/AuthLoginCarousel";
import {
  AUTH_ONBOARDING_PHONE_PATH,
  LOGIN_FAILURE_MESSAGE,
} from "@/features/auth/constants/auth";
import type { OnboardingLocationState } from "@/features/auth/utils/onboardingState";
import { isInAppShell } from "@/lib/bridge/bridge";

// Figma: 로그인 1~3 (nodeId 3658:113051, 3658:113028, 3658:113074) — 화면설계서(3747:74283) 2·3번.
// `K-CONNECT로 시작하기`는 인증 후 신규 사용자면 온보딩으로, 기존 사용자(유효 세션)면 홈으로 보낸다.
// 실패·취소·네트워크 오류는 토스트로 알린다. 인증 사이트와 API는 아직 없어서 entities/auth의 목 로그인이다.
function AuthLoginScreen() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  // 실패가 연달아 나도 스크린리더가 토스트를 다시 안내하도록 실패마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const user = await loginWithKConnect();
      if (user.isNewUser) {
        navigate(AUTH_ONBOARDING_PHONE_PATH, {
          state: { name: user.name } satisfies OnboardingLocationState,
          viewTransition: true,
        });
        return;
      }
      markLoggedIn();
      navigate("/", { replace: true });
    } catch (error) {
      console.warn(LOGIN_FAILURE_MESSAGE, error);
      setToastOpen(true);
      setToastToken((token) => token + 1);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 앱 WebView에서는 Figma 그대로 위에서 72px에 시작하고 버튼을 바닥에 붙인다 — Figma 프레임의 상태 표시줄
  // (54px)은 앱 셸 몫이라 웹 영역은 그 아래에서 시작한다. 브라우저는 창 전체가 웹 영역이라 같은 값을 쓰면
  // 본문이 위로 치우쳐 보여서, 버튼 위 영역의 세로 가운데에 놓는다(auto 마진이 남는 공간을 위아래로 나눈다).
  const isInApp = isInAppShell();

  return (
    <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden bg-background-normal">
      <div
        className={`flex flex-col items-center gap-17 ${
          isInApp ? "mt-18" : "my-auto"
        }`}
      >
        <AuthBrandHeader />
        <AuthLoginCarousel />
      </div>

      <div className={`shrink-0 ${isInApp ? "mt-auto" : ""}`}>
        <div className="p-5">
          <AuthKConnectButton isLoading={isLoggingIn} onClick={handleLogin} />
        </div>
        {/* 버튼 영역 아래 padding 20px + 14px = Figma Bottom Safe Area 34px. 앱 WebView에서는
            네이티브 세이프에어리어와 겹쳐서 데스크톱 프레임에서만 남긴다. */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>

      <ScreenToast
        key={toastToken}
        message={LOGIN_FAILURE_MESSAGE}
        onOpenChange={setToastOpen}
        open={toastOpen}
      />
    </div>
  );
}

export default AuthLoginScreen;
