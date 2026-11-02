import type { ReactNode } from "react";
import { Navigate, useMatches } from "react-router-dom";

import { isLoggedIn } from "@/entities/auth/session";
import { LOGIN_PATH } from "@/features/auth/constants/auth";

// 로그인 없이 열 수 있는 라우트의 표시 — router.tsx에서 `handle: { isPublic: true } satisfies AuthRouteHandle`로 지정한다
// (레이아웃 옵션 handle과 한 객체에 같이 쓰면 `ScreenRouteHandle & AuthRouteHandle`로 검사한다).
// 표시하지 않은 라우트는 모두 로그인이 필요한 화면으로 본다 — 새 화면을 추가해도 가드가 자동으로 걸리고,
// 로그인·콜백처럼 열려 있어야 하는 화면만 의식적으로 표시한다.
export interface AuthRouteHandle {
  isPublic?: boolean;
}

// useMatches()는 handle을 unknown으로 준다. AuthRouteHandle은 필드가 선택이라 객체면 이 타입으로 본다.
function isAuthRouteHandle(handle: unknown): handle is AuthRouteHandle {
  return typeof handle === "object" && handle !== null;
}

interface AuthEntryGateProps {
  children: ReactNode;
}

// 모든 화면의 로그인 가드 — router.tsx에서 레이아웃 라우트(ScreenLayoutRoute)를 감싸서 그 아래 모든 라우트에 건다.
// 이 탭에서 로그인한 기록이 없으면 공개 라우트(`isPublic`)가 아닌 화면은 로그인(`LOGIN_PATH`)으로 보낸다(replace라
// 뒤로가기로 돌아오지 않는다). 주소에 없는 경로(`*`)도 로그인 전에는 로그인으로 간다.
// 로그인 표시는 sessionStorage에만 있어서, 같은 탭의 새로고침은 화면이 유지되고 탭·브라우저를 새로 열 때만
// 로그인 화면으로 보낸다. 이 가드는 화면 이동을 정리할 뿐이고 접근 통제가 아니다 — 표시는 클라이언트가
// 바꿀 수 있어서 실제 인증은 서버 API가 검증해야 한다.
// 로그인한 상태에서 로그인 화면으로 오는 경우는 이 가드가 아니라 로그인 퍼널(AuthSignupScreen)이 홈으로 보낸다.
function AuthEntryGate({ children }: AuthEntryGateProps) {
  const isPublic = useMatches().some(
    (match) => isAuthRouteHandle(match.handle) && match.handle.isPublic,
  );

  if (!isPublic && !isLoggedIn()) {
    return <Navigate replace to={LOGIN_PATH} />;
  }
  return children;
}

export default AuthEntryGate;
