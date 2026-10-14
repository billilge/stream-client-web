import { useKConnectLogin } from "@billilge/oauth-kconnect/react";
import { useState } from "react";

import ScreenToast from "@/components/ui/ScreenToast";
import {
  isMockKConnectKind,
  mockKConnectLogin,
} from "@/entities/auth/authMock";
import type { KConnectUser } from "@/entities/auth/types";
import AuthBrandHeader from "@/features/auth/components/AuthBrandHeader";
import AuthKConnectButton from "@/features/auth/components/AuthKConnectButton";
import AuthLoginCarousel from "@/features/auth/components/AuthLoginCarousel";
import {
  KCONNECT_CLIENT_ID,
  LOGIN_FAILURE_MESSAGE,
} from "@/features/auth/constants/auth";
import { isInAppShell } from "@/lib/bridge/bridge";

// 로그인 — 화면설계서 2·3번. `K-CONNECT로 시작하기`를 누르면 K-CONNECT 인증 사이트로 페이지가 이동하고(@billilge/oauth-kconnect),
// 인증을 마치면 `/oauth/kconnect`(KConnectCallbackScreen)가 결과를 받아 신규 사용자는 연락처 단계로, 기존 사용자는 홈으로 보낸다.
// 취소·오류·네트워크 오류로 돌아오면 이 화면에서 토스트로 알린다.
function AuthLoginStep({
  hasFailedLogin,
  onMockLoggedIn,
}: {
  hasFailedLogin: boolean;
  /** 개발 서버 전용 우회(`?mockKConnect=`)로 인증된 것으로 칠 때 */
  onMockLoggedIn: (user: KConnectUser) => void;
}) {
  const { login } = useKConnectLogin({ clientId: KCONNECT_CLIENT_ID });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(hasFailedLogin);
  // 실패가 연달아 나도 스크린리더가 토스트를 다시 안내하도록 실패마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);

  const showFailure = () => {
    setToastOpen(true);
    setToastToken((token) => token + 1);
  };

  const handleLogin = async () => {
    // 개발 서버에서만: 주소에 `?mockKConnect=new|existing`가 있으면 K-CONNECT 인증 사이트로 가지 않고 인증된 것으로 친다.
    // `import.meta.env.DEV`가 상수로 치환되어 배포 빌드에서는 이 분기가 통째로 빠진다.
    if (import.meta.env.DEV) {
      const mockKind = new URLSearchParams(window.location.search).get(
        "mockKConnect",
      );
      if (isMockKConnectKind(mockKind)) {
        setIsLoggingIn(true);
        onMockLoggedIn(await mockKConnectLogin(mockKind));
        setIsLoggingIn(false);
        return;
      }
    }
    if (!KCONNECT_CLIENT_ID) {
      console.warn(
        "VITE_KCONNECT_CLIENT_ID가 없어서 K-CONNECT 로그인을 시작할 수 없어요(.env.example 참고).",
      );
      showFailure();
      return;
    }
    setIsLoggingIn(true);
    try {
      // 성공하면 페이지가 K-CONNECT로 넘어가서 이 화면으로 돌아오지 않는다 — 그동안 버튼은 눌린 상태로 둔다
      await login();
    } catch (error) {
      console.warn(LOGIN_FAILURE_MESSAGE, error);
      setIsLoggingIn(false);
      showFailure();
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

export default AuthLoginStep;
