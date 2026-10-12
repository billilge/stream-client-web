import {
  ActionArea,
  ActionAreaButton,
  Divider,
  TextField,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { loginWithKConnect, submitOnboarding } from "@/entities/auth/authApi";
import { markLoggedIn } from "@/entities/auth/session";
import type { KConnectUser } from "@/entities/auth/types";
import AuthBrandHeader from "@/features/auth/components/AuthBrandHeader";
import AuthKConnectButton from "@/features/auth/components/AuthKConnectButton";
import AuthLoginCarousel from "@/features/auth/components/AuthLoginCarousel";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import AuthTermsAgreementRow from "@/features/auth/components/AuthTermsAgreementRow";
import AuthTermsSection from "@/features/auth/components/AuthTermsSection";
import {
  INITIAL_TERMS_AGREEMENTS,
  isTermsId,
  LOGIN_FAILURE_MESSAGE,
  PHONE_DIGIT_COUNT,
  TERMS,
  TERMS_IDS,
  type TermsAgreements,
  type TermsId,
} from "@/features/auth/constants/auth";
import {
  formatPhoneNumber,
  toPhoneDigits,
} from "@/features/auth/utils/formatPhoneNumber";
import { isInAppShell } from "@/lib/bridge/bridge";
import { useFunnel } from "@/lib/useFunnel";

// 로그인과 온보딩(연락처 → 약관 동의 → 약관 상세 → 가입 완료)을 useFunnel 하나로 묶은 화면이다.
// Figma: 스플래시 & 로그인 (nodeId 3658:112096), 온보딩 (3738:73115) / 화면설계서 3747:74283, 3747:74298.
// 단계는 `/auth?auth.step=...`으로 나뉘고 단계마다 브라우저 뒤로가기가 한 단계씩 돌아간다. 단계 사이에 넘기는 값
// (이름·연락처·약관 동의)은 퍼널 context가 들고 있어서 약관 상세에서 돌아와도 유지된다.
// 스플래시는 웹에서 쓰지 않아 이 퍼널에 없다.

type AuthFunnelSteps = {
  login: Record<never, never>;
  phone: { name: string; phone?: string };
  terms: { name: string; phone: string; agreements: TermsAgreements };
  termsDetail: {
    name: string;
    phone: string;
    agreements: TermsAgreements;
    termsId: TermsId;
  };
  complete: { name: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTermsAgreements(value: unknown): value is TermsAgreements {
  return (
    isRecord(value) && TERMS_IDS.every((id) => typeof value[id] === "boolean")
  );
}

// 새로고침이나 주소 직접 입력처럼 앞 단계의 값이 없는 채로 중간 단계에 들어오면 guard가 걸러서 첫 단계(로그인)로
// 돌려보낸다 — 이름이나 연락처 없이 약관 동의 화면이 열리는 일이 없다.
const AUTH_FUNNEL_STEP_OPTIONS = {
  complete: {
    guard: (data: unknown): data is AuthFunnelSteps["complete"] =>
      isRecord(data) && typeof data.name === "string",
  },
  login: {
    guard: (data: unknown): data is AuthFunnelSteps["login"] => isRecord(data),
  },
  phone: {
    guard: (data: unknown): data is AuthFunnelSteps["phone"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      (data.phone === undefined || typeof data.phone === "string"),
  },
  terms: {
    guard: (data: unknown): data is AuthFunnelSteps["terms"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phone === "string" &&
      isTermsAgreements(data.agreements),
  },
  termsDetail: {
    guard: (data: unknown): data is AuthFunnelSteps["termsDetail"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phone === "string" &&
      isTermsAgreements(data.agreements) &&
      typeof data.termsId === "string" &&
      isTermsId(data.termsId),
  },
};

// 모든 단계의 헤더가 같은 뒤로가기 버튼을 쓴다
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <TopNavigationButton aria-label="뒤로가기" onClick={onClick} variant="icon">
      <IconChevronLeft />
    </TopNavigationButton>
  );
}

// 하단 고정 버튼 영역 — WDS ActionAreaButton은 세로 padding 12px(48px)인데 Figma Main Action은 16px(56px)이라 맞춘다.
// ActionArea 아래 padding 20px + 14px = Figma Bottom Safe Area 34px(앱 WebView에서는 네이티브 세이프에어리어와
// 겹쳐서 데스크톱 프레임에서만 남긴다).
function BottomAction({
  label,
  disabled = false,
  onClick,
  hasBackground = false,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  hasBackground?: boolean;
}) {
  return (
    <div className="shrink-0">
      <ActionArea background={hasBackground}>
        <ActionAreaButton
          disabled={disabled}
          onClick={onClick}
          sx={{ paddingBlock: "16px" }}
        >
          {label}
        </ActionAreaButton>
      </ActionArea>
      <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
    </div>
  );
}

// 로그인 — 화면설계서 2·3번. `K-CONNECT로 시작하기`는 인증 후 신규 사용자면 온보딩으로, 기존 사용자면 홈으로 보낸다.
// 실패·취소·네트워크 오류는 토스트로 알린다. 인증 사이트와 API는 아직 없어서 entities/auth의 목 로그인이다.
function LoginStep({
  onLoggedIn,
}: {
  onLoggedIn: (user: KConnectUser) => void;
}) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  // 실패가 연달아 나도 스크린리더가 토스트를 다시 안내하도록 실패마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      onLoggedIn(await loginWithKConnect());
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

// 온보딩 1/2 연락처 — 화면설계서(3747:74298) 1~3번. 인삿말에 K-CONNECT가 알려 준 이름을 넣고, 숫자만 입력해도
// 하이픈이 자동으로 들어간다. 11자리를 모두 입력해야 `다음`이 켜진다.
function PhoneStep({
  name,
  initialPhone,
  onBack,
  onChangePhone,
  onNext,
}: {
  name: string;
  initialPhone: string;
  onBack: () => void;
  /** 입력할 때마다 퍼널 context에 반영한다 — 약관 동의에서 뒤로 돌아와도 번호가 남는다 */
  onChangePhone: (phone: string) => void;
  onNext: (phone: string) => void;
}) {
  const [digits, setDigits] = useState(() => toPhoneDigits(initialPhone));

  useScreenHeader(
    <ScreenHeader leading={<BackButton onClick={onBack} />} variant="normal" />,
  );

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-2 px-5 pt-3">
        <AuthOnboardingHeading step="1 / 2">
          <span className="block">{name} 님, 반가워요!</span>
          <span className="block">연락처를 알려 주세요</span>
        </AuthOnboardingHeading>
        <div className="flex flex-col gap-5">
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            행사 신청을 위해 필요한 정보예요.
          </Typography>
          <TextField
            aria-label="연락처"
            autoComplete="tel"
            inputMode="numeric"
            onChange={(event) => {
              const nextDigits = toPhoneDigits(event.target.value);
              setDigits(nextDigits);
              onChangePhone(nextDigits);
            }}
            placeholder="ex) 010-1234-5677"
            type="tel"
            value={formatPhoneNumber(digits)}
            width="100%"
          />
        </div>
      </div>

      <BottomAction
        disabled={digits.length !== PHONE_DIGIT_COUNT}
        label="다음"
        onClick={() => onNext(digits)}
      />
    </div>
  );
}

// 온보딩 2/2 약관 동의 — 화면설계서 4~7번. 필수 약관 2개(서비스 이용약관, 개인정보 수집·이용)에 모두 동의해야 `다음`이
// 켜지고, 선택 약관(알림 수신)은 미동의여도 진행한다. 각 행 오른쪽 화살표는 약관 상세로 간다.
// 전체 동의 ↔ 개별 항목은 연동된다 — 전체를 누르면 세 항목을 같은 값으로 맞추고, 전체는 따로 저장하지 않고
// 세 항목이 모두 켜졌는지로 파생한다.
function TermsStep({
  agreements,
  onBack,
  onChangeAgreements,
  onOpenDetail,
  onComplete,
}: {
  agreements: TermsAgreements;
  onBack: () => void;
  onChangeAgreements: (next: TermsAgreements) => void;
  onOpenDetail: (termsId: TermsId) => void;
  onComplete: () => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAllAgreed = TERMS_IDS.every((id) => agreements[id]);
  const isRequiredAgreed = agreements.service && agreements.privacy;

  useScreenHeader(
    <ScreenHeader leading={<BackButton onClick={onBack} />} variant="normal" />,
  );

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
    } catch (error) {
      console.warn("온보딩 정보를 저장하지 못했어요.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-5 px-5 pt-3">
        <AuthOnboardingHeading step="2 / 2">
          <span className="block">서비스 이용을 위해</span>
          <span className="block">약관 동의가 필요해요</span>
        </AuthOnboardingHeading>
        <div className="flex flex-col gap-1">
          <AuthTermsAgreementRow
            checked={isAllAgreed}
            isBold
            label="전체 동의하기"
            onCheckedChange={(checked) =>
              onChangeAgreements({
                notifications: checked,
                privacy: checked,
                service: checked,
              })
            }
          />
          <Divider color="semantic.line.normal.normal" />
          {TERMS_IDS.map((id) => (
            <AuthTermsAgreementRow
              checked={agreements[id]}
              key={id}
              label={`[${TERMS[id].isRequired ? "필수" : "선택"}] ${TERMS[id].label}`}
              onCheckedChange={(checked) =>
                onChangeAgreements({ ...agreements, [id]: checked })
              }
              onOpenDetail={() => onOpenDetail(id)}
            />
          ))}
        </div>
      </div>

      <BottomAction
        disabled={!isRequiredAgreed || isSubmitting}
        label="다음"
        onClick={handleComplete}
      />
    </div>
  );
}

// 약관 상세 — 화면설계서 7번. 하단 `확인했어요`나 뒤로가기는 약관 동의로 돌아가기만 한다 — 상세를 보거나
// 확인했다는 것만으로는 동의 상태가 바뀌지 않는다.
function TermsDetailStep({
  termsId,
  onBack,
}: {
  termsId: TermsId;
  onBack: () => void;
}) {
  const terms = TERMS[termsId];

  useScreenHeader(
    <ScreenHeader
      leading={<BackButton onClick={onBack} />}
      title={terms.title}
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col bg-background-normal">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-2 pb-10">
        {terms.sections.map((section, index) => (
          <Fragment key={section.title}>
            {index > 0 && <Divider color="semantic.line.normal.alternative" />}
            <AuthTermsSection
              body={section.body}
              isFirst={index === 0}
              title={section.title}
            />
          </Fragment>
        ))}
      </div>

      <BottomAction hasBackground label="확인했어요" onClick={onBack} />
    </div>
  );
}

// 가입 완료 — 화면설계서 8번. 체크 로띠가 재생되고 `stream 시작하기`나 상단 닫기(X)는 홈으로 보낸다.
// 신청 완료 화면과 같은 뼈대라 공용 ResultScreen을 쓴다.
function CompleteStep({ onStart }: { onStart: () => void }) {
  return (
    <ResultScreen
      description="stream에 오신 걸 환영해요."
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={onStart}
      primaryAction={{ label: "stream 시작하기", onClick: onStart }}
      title="가입을 완료했어요!"
    />
  );
}

// 단계가 바뀌는 이동에만 슬라이드를 켠다 — 체크박스·연락처 입력처럼 같은 단계의 context만 갈아 끼우는 replace에는
// 켜지 않는다. 뒤로가기는 React Router가 앞선 이동을 기억해 반대 방향으로 자동 적용한다(coding-style.md 라우팅).
const SLIDE = { viewTransition: true };

function AuthFunnelScreen() {
  const navigate = useNavigate();
  const funnel = useFunnel<AuthFunnelSteps>({
    id: "auth",
    initial: { context: {}, step: "login" },
    steps: AUTH_FUNNEL_STEP_OPTIONS,
  });

  const goHome = () => navigate("/", { replace: true });

  return (
    <funnel.Render
      complete={() => <CompleteStep onStart={goHome} />}
      login={({ history }) => (
        <LoginStep
          onLoggedIn={(user) => {
            if (user.isNewUser) {
              history.push("phone", { name: user.name }, SLIDE);
              return;
            }
            markLoggedIn();
            goHome();
          }}
        />
      )}
      phone={({ context, history }) => (
        <PhoneStep
          initialPhone={context.phone ?? ""}
          name={context.name}
          onBack={() => history.back()}
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
        <TermsStep
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
        <TermsDetailStep
          onBack={() => history.back()}
          termsId={context.termsId}
        />
      )}
    />
  );
}

export default AuthFunnelScreen;
