import { useEffect, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { HOME_PATH } from "@/constants/paths";
import { submitOnboarding } from "@/entities/auth/authApi";
import { isLoggedIn, markLoggedIn } from "@/entities/auth/session";
import { INITIAL_TERMS_AGREEMENTS } from "@/features/auth/constants/auth";
import {
  AUTH_SIGNUP_STEP_OPTIONS,
  type AuthSignupSteps,
} from "@/features/auth/constants/authSignupFunnel";
import AuthCompleteStep from "@/features/auth/steps/AuthCompleteStep";
import AuthLoginStep from "@/features/auth/steps/AuthLoginStep";
import AuthPhoneStep from "@/features/auth/steps/AuthPhoneStep";
import AuthTermsDetailStep from "@/features/auth/steps/AuthTermsDetailStep";
import AuthTermsStep from "@/features/auth/steps/AuthTermsStep";
import { readAuthLocationState } from "@/features/auth/utils/authLocationState";
import { useFunnel } from "@/lib/useFunnel";

// 로그인과 가입(연락처 → 약관 동의 → 약관 상세 → 가입 완료)을 useFunnel 하나로 묶은 화면이다. 단계 화면은 `steps/`에
// 하나씩 나눠 두고, 이 파일은 단계 전환(어느 단계에서 어디로, 무슨 값을 넘기는지)만 맡는다.
// 단계는 `/auth?auth.step=...`으로 나뉘고 단계마다 브라우저 뒤로가기가 한 단계씩 돌아간다. 단계 사이에 넘기는 값
// (이름·연락처·약관 동의)은 퍼널 context가 들고 있어서 약관 상세에서 돌아와도 유지된다.
// 스플래시는 웹에서 쓰지 않아 이 퍼널에 없다.

// 단계가 바뀌는 이동에만 슬라이드를 켠다 — 체크박스·연락처 입력처럼 같은 단계의 context만 갈아 끼우는 replace에는
// 켜지 않는다. 뒤로가기는 React Router가 앞선 이동을 기억해 반대 방향으로 자동 적용한다(coding-style.md 라우팅).
const SLIDE = { viewTransition: true };

function AuthSignupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  // K-CONNECT 콜백(KConnectCallbackScreen)이 신규 사용자를 이름과 함께 보내면 로그인을 건너뛰고 연락처 단계에서 시작한다.
  // `initial`은 주소에 단계가 없을 때만 쓰여서, 단계가 생긴 뒤(약관 동의 등)에는 영향이 없다.
  const { kConnectName, loginFailed } = readAuthLocationState(location.state);
  // useFunnel이 `initial`로 값을 다시 계산하지 않도록 kConnectName이 바뀔 때만 새 객체를 만든다
  const initial = useMemo(
    () =>
      kConnectName
        ? ({ context: { name: kConnectName }, step: "phone" } as const)
        : ({ context: {}, step: "login" } as const),
    [kConnectName],
  );
  const funnel = useFunnel<AuthSignupSteps>({
    id: "auth",
    initial,
    steps: AUTH_SIGNUP_STEP_OPTIONS,
  });

  // 로그인 실패 토스트는 한 번만 띄운다 — 화면이 처음 그려질 때 AuthLoginStep이 값을 읽어 가고, 그 뒤에는 state를
  // 지워서 새로고침하거나 다른 단계에서 돌아와도 실패하지 않았는데 토스트가 다시 뜨지 않게 한다.
  useEffect(() => {
    if (loginFailed) {
      navigate(
        { pathname: location.pathname, search: location.search },
        { replace: true, state: null },
      );
    }
  }, [loginFailed, location.pathname, location.search, navigate]);

  // 로그인한 상태로 이 퍼널에 들어오면 홈으로 보낸다 — 가입을 마친 뒤 홈에서 뒤로가기를 눌러 연락처 단계로 돌아와
  // 가입을 한 번 더 진행하는 일을 막는다. 가입 완료 단계는 로그인 표시를 남긴 직후에 보여 주는 화면이라 예외다.
  if (funnel.step !== "complete" && isLoggedIn()) {
    return <Navigate replace to={HOME_PATH} />;
  }

  const goHome = () => navigate(HOME_PATH, { replace: true });

  return (
    <funnel.Render
      complete={() => <AuthCompleteStep onStart={goHome} />}
      login={({ history }) => (
        <AuthLoginStep
          hasFailedLogin={loginFailed === true}
          onMockLoggedIn={(user) => {
            if (user.isNewUser) {
              history.push("phone", { name: user.name }, SLIDE);
              return;
            }
            markLoggedIn();
            goHome();
          }}
        />
      )}
      phone={({ context, history, index }) => (
        <AuthPhoneStep
          initialPhone={context.phone ?? ""}
          name={context.name}
          // K-CONNECT 콜백에서 바로 연락처 단계로 들어온 경우 퍼널 기록이 이 단계 하나뿐이라, 뒤로가기가 K-CONNECT 쪽
          // 페이지로 나가 버린다 — 이때는 로그인 단계로 대체해서 로그인 화면으로 돌아가게 한다.
          onBack={() =>
            index === 0 ? history.replace("login", {}) : history.back()
          }
          // 단계를 바꾸지 않고 context만 갈아 끼운다(replace)
          onChangePhone={(phone) =>
            history.replace("phone", (prev) => ({ ...prev, phone }))
          }
          onNext={(phone) =>
            history.push(
              "terms",
              { agreements: INITIAL_TERMS_AGREEMENTS, phone },
              SLIDE,
            )
          }
        />
      )}
      terms={({ context, history }) => (
        <AuthTermsStep
          agreements={context.agreements}
          onBack={() => history.back()}
          // 단계를 바꾸지 않고 context만 갈아 끼운다(replace) — 약관 상세를 다녀와도 동의 상태가 남는다
          onChangeAgreements={(agreements) =>
            history.replace("terms", (prev) => ({ ...prev, agreements }))
          }
          onComplete={async () => {
            await submitOnboarding({
              hasAgreedNotifications: context.agreements.notifications,
              name: context.name,
              phone: context.phone,
            });
            markLoggedIn();
            // 가입을 마치면 약관 동의로 돌아올 일이 없어서 히스토리를 대체한다
            history.replace("complete", {}, SLIDE);
          }}
          onOpenDetail={(termsId) =>
            history.push("termsDetail", { termsId }, SLIDE)
          }
        />
      )}
      termsDetail={({ context, history }) => (
        <AuthTermsDetailStep
          onBack={() => history.back()}
          termsId={context.termsId}
        />
      )}
    />
  );
}

export default AuthSignupScreen;
