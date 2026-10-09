import { Typography } from "@wanteddev/wds";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import streamLogo from "@/assets/icons/auth/stream-logo.svg";
import streamWordmark from "@/assets/icons/auth/stream-wordmark-splash.svg";
import { isLoggedIn } from "@/entities/auth/session";
import {
  AUTH_LOGIN_PATH,
  AUTH_SPLASH_DURATION_MS,
} from "@/features/auth/constants/auth";
import { isInAppShell } from "@/lib/bridge/bridge";

// Figma: 스플래시 (nodeId 3658:113097) — 화면설계서(3747:74283) 1번: 중앙 심볼이 먼저 페이드인하고
// 0.5초 뒤 슬로건과 stream 워드마크가 함께 페이드인, 완성 상태를 잠깐 유지해 총 1.2초 뒤 넘어간다.
// 유효한 로그인 세션이 있으면 로그인 화면을 건너뛰고 홈으로 간다(3번).
function AuthSplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(isLoggedIn() ? "/" : AUTH_LOGIN_PATH, { replace: true });
    }, AUTH_SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  // 위치를 px이 아니라 화면 높이의 비율로 잡아서 화면 크기에 따라 같이 움직인다. 비율은 Figma 프레임에서
  // 상태 표시줄(54px)과 홈 바(34px)를 뺀 앱 WebView 영역(높이 724px) 기준이다:
  //   심볼 세로 중심 y=358 → 영역 안 304px → 42%
  //   워드마크 바닥 y=719 → 영역 바닥에서 59px → 8.15%
  // 브라우저는 창 전체가 웹 영역이라 같은 비율이면 심볼이 위로 치우쳐 보여서, 앱이 아닐 때만 세로 정가운데
  // (50%)에 둔다. 앱 여부는 앱 연동에 이미 쓰는 isInAppShell로 가린다.
  const isInApp = isInAppShell();

  return (
    <div className="relative h-full bg-background-normal">
      <img
        alt="stream"
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 animate-auth-fade-in-logo motion-reduce:animate-none ${
          isInApp ? "top-[42%]" : "top-1/2"
        }`}
        src={streamLogo}
      />
      <div className="absolute inset-x-0 bottom-[8.15%] flex animate-auth-fade-in-copy flex-col items-center gap-2 motion-reduce:animate-none">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="caption1"
          weight="medium"
        >
          흩어진 대학생활을 하나로
        </Typography>
        <img alt="" src={streamWordmark} />
      </div>
    </div>
  );
}

export default AuthSplashScreen;
