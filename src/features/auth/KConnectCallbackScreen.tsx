import { useKConnectCallback } from "@billilge/oauth-kconnect/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { HOME_PATH, LOGIN_PATH } from "@/constants/paths";
import { exchangeKConnectCode } from "@/entities/auth/authApi";
import { markLoggedIn } from "@/entities/auth/session";
import { LOGIN_FAILURE_MESSAGE } from "@/features/auth/constants/auth";
import type { AuthLocationState } from "@/features/auth/utils/authLocationState";

// K-CONNECT가 인증을 마치고 되돌려 보내는 redirect URI 라우트(`/oauth/kconnect`) — 경로는 K-CONNECT에 등록한
// 값이자 @billilge/oauth-kconnect가 정한 값이라 바꾸지 않는다. 보여 줄 UI는 없고 결과를 받아 처리한 뒤 이동한다:
//   성공 → 서버로 보내 서비스 로그인을 마친다. 신규 사용자는 로그인 퍼널의 연락처 단계로, 기존 사용자는 홈으로 간다
//   취소·오류(국민대 학생이 아니어서 K-CONNECT가 거부한 경우 포함) → 로그인 화면에서 실패 토스트를 띄운다
// 주소창에 `code`가 남지 않도록 어느 경우든 replace로 이동한다(oauth-kconnect README 안내).
function KConnectCallbackScreen() {
  const navigate = useNavigate();
  const result = useKConnectCallback();
  // StrictMode가 효과를 두 번 돌려도 일회용 인증 code를 서버로 두 번 보내지 않는다
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) {
      return;
    }
    hasHandled.current = true;

    const goBackToLogin = () =>
      navigate(LOGIN_PATH, {
        replace: true,
        state: { loginFailed: true } satisfies AuthLocationState,
      });

    if (result.type !== "success") {
      if (result.type === "error") {
        console.warn(LOGIN_FAILURE_MESSAGE, result.error);
      }
      goBackToLogin();
      return;
    }

    // result에는 `type`도 들어 있어서, 서버가 쓰는 세 값만 꺼내 넘긴다
    const { code, codeVerifier, redirectUri } = result;
    exchangeKConnectCode({ code, codeVerifier, redirectUri })
      .then((user) => {
        if (user.isNewUser) {
          navigate(LOGIN_PATH, {
            replace: true,
            state: { kConnectName: user.name } satisfies AuthLocationState,
          });
          return;
        }
        markLoggedIn();
        navigate(HOME_PATH, { replace: true });
      })
      .catch((error: unknown) => {
        console.warn(LOGIN_FAILURE_MESSAGE, error);
        goBackToLogin();
      });
  }, [result, navigate]);

  return <div aria-busy className="h-full bg-background-normal" />;
}

export default KConnectCallbackScreen;
