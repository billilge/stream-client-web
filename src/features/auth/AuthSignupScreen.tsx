import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ScreenToast from "@/components/ui/ScreenToast";
import { INITIAL_TERMS_AGREEMENTS } from "@/features/auth/constants/auth";
import {
  AUTH_SIGNUP_STEP_OPTIONS,
  type AuthSignupSteps,
} from "@/features/auth/constants/authSignupFunnel";
import AuthCompleteStep from "@/features/auth/steps/AuthCompleteStep";
import AuthEmailCodeStep from "@/features/auth/steps/AuthEmailCodeStep";
import AuthEmailStep from "@/features/auth/steps/AuthEmailStep";
import AuthLoginStep from "@/features/auth/steps/AuthLoginStep";
import AuthPhoneStep from "@/features/auth/steps/AuthPhoneStep";
import AuthTermsDetailStep from "@/features/auth/steps/AuthTermsDetailStep";
import AuthTermsStep from "@/features/auth/steps/AuthTermsStep";
import { readAuthLocationState } from "@/features/auth/utils/authLocationState";
import { getSignUpEmailErrorMessage } from "@/features/auth/utils/emailVerificationErrorMessage";
import { HOME_PATH } from "@/features/home/constants/home";
import { useFunnel } from "@/lib/useFunnel";
import { isLoggedIn, markLoggedIn } from "@/shared/entities/auth/session";
import {
  requestEmailVerification,
  submitOnboarding,
} from "@/shared/entities/members/membersQueries";

// 로그인과 가입(연락처 → 이메일 인증 → 약관 동의 → 약관 상세 → 가입 완료)을 useFunnel 하나로 묶은 화면이다. 연락처와 이메일 인증은
// K-CONNECT 인증을 마친 신규 사용자만 거친다(기존 사용자는 홈으로 바로 간다). 단계 화면은 `steps/`에
// 하나씩 나눠 두고, 이 파일은 단계 전환(어느 단계에서 어디로, 무슨 값을 넘기는지)만 맡는다.
// 단계는 `/login?auth.step=...`으로 나뉘고 단계마다 브라우저 뒤로가기가 한 단계씩 돌아간다. 단계 사이에 넘기는 값
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
    // use-funnel은 퍼널이 언마운트될 때 주소의 단계(`?auth.step=`)와 context를 지운다. 개발 모드의 StrictMode는 첫
    // 마운트 직후 한 번 언마운트했다가 다시 붙여서, 새로고침하면 이 정리가 돌아 단계가 사라지고 첫 단계로 돌아간다.
    // 퍼널을 떠날 때는 다른 주소로 이동해서 지울 단계가 남지 않으므로 정리를 끈다.
    disableCleanup: true,
    id: "auth",
    initial,
    steps: AUTH_SIGNUP_STEP_OPTIONS,
  });
  // 단계를 옮기면서 띄우는 안내(가입 때 이메일을 다시 인증해야 할 때) — 단계 화면의 토스트는 단계가 바뀌면 함께
  // 사라져서 퍼널이 들고 있는다
  const [stepToastMessage, setStepToastMessage] = useState("");
  const [stepToastOpen, setStepToastOpen] = useState(false);

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

  // 로그인한 상태로 이 퍼널에 들어오면 홈으로 보낸다 — 가입을 마친 뒤 홈에서 뒤로가기를 눌러 연락처·이메일 단계로 돌아와
  // 가입을 한 번 더 진행하는 일을 막는다. 가입 완료 단계는 로그인 표시를 남긴 직후에 보여 주는 화면이라 예외다.
  if (funnel.step !== "complete" && isLoggedIn()) {
    return <Navigate replace to={HOME_PATH} />;
  }

  const goHome = () => navigate(HOME_PATH, { replace: true });

  return (
    <>
      <funnel.Render
        complete={() => <AuthCompleteStep onStart={goHome} />}
        email={({ context, history }) => (
          <AuthEmailStep
            initialEmail={context.email ?? ""}
            onBack={() => history.back()}
            // 단계를 바꾸지 않고 context만 갈아 끼운다(replace) — 인증번호 단계에서 뒤로 돌아와도 이메일이 남는다
            onChangeEmail={(email) =>
              history.replace("email", (prev) => ({ ...prev, email }))
            }
            onNext={async (email) => {
              await requestEmailVerification(email);
              history.push(
                "emailCode",
                { codeSentAt: Date.now(), email },
                SLIDE,
              );
            }}
          />
        )}
        emailCode={({ context, history }) => (
          <AuthEmailCodeStep
            codeSentAt={context.codeSentAt}
            email={context.email}
            onBack={() => history.back()}
            // 단계를 바꾸지 않고 context만 갈아 끼운다(replace) — 새로고침해도 다시 보낸 시각부터 센다
            onResent={(codeSentAt) =>
              history.replace("emailCode", (prev) => ({ ...prev, codeSentAt }))
            }
            // 인증을 마치면 이 단계로 돌아올 일이 없어서 히스토리를 대체한다 — 약관 동의에서 뒤로가면 이메일 단계로 간다
            onVerified={() =>
              history.replace(
                "terms",
                { agreements: INITIAL_TERMS_AGREEMENTS },
                SLIDE,
              )
            }
          />
        )}
        login={() => <AuthLoginStep hasFailedLogin={loginFailed === true} />}
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
            onNext={(phone) => history.push("email", { phone }, SLIDE)}
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
              try {
                await submitOnboarding({
                  email: context.email,
                  hasAgreedNotifications: context.agreements.notifications,
                  name: context.name,
                  phone: context.phone,
                });
              } catch (error) {
                // 인증한 지 30분이 지났거나 그사이 다른 회원이 이 이메일로 가입했다 — 이메일 단계로 돌아가 다시 인증한다.
                // 인증번호 단계는 약관 동의로 대체됐으므로 한 단계 뒤가 이메일 단계다.
                const emailErrorMessage = getSignUpEmailErrorMessage(error);
                if (!emailErrorMessage) {
                  throw error;
                }
                console.warn(emailErrorMessage, error);
                setStepToastMessage(emailErrorMessage);
                setStepToastOpen(true);
                history.back();
                return;
              }
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
      <ScreenToast
        message={stepToastMessage}
        onOpenChange={setStepToastOpen}
        open={stepToastOpen}
      />
    </>
  );
}

export default AuthSignupScreen;
