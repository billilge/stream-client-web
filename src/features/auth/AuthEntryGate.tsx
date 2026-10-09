import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { isLoggedIn } from "@/entities/auth/session";
import { AUTH_SPLASH_PATH } from "@/features/auth/constants/auth";

interface AuthEntryGateProps {
  children: ReactNode;
}

// 앱 첫 진입점(`/`)에서만 로그인 여부를 본다 — 이 탭에서 로그인한 기록이 없으면 스플래시로 보내고(스플래시가
// 1.2초 뒤 로그인 화면으로 넘긴다, replace라 뒤로가기로 돌아오지 않는다), 있으면 홈을 그대로 보여 준다.
// 다른 화면(`/events` 등)으로 직접 들어오는 경로에는 가드를 걸지 않는다.
// 로그인 표시는 sessionStorage에만 있어서, 같은 탭의 새로고침은 홈이 유지되고 탭·브라우저를 새로 열 때만
// 이 가드가 스플래시로 보낸다.
function AuthEntryGate({ children }: AuthEntryGateProps) {
  if (!isLoggedIn()) {
    return <Navigate replace to={AUTH_SPLASH_PATH} />;
  }
  return children;
}

export default AuthEntryGate;
