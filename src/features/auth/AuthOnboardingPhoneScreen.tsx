import {
  ActionArea,
  ActionAreaButton,
  TextField,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import {
  AUTH_LOGIN_PATH,
  AUTH_ONBOARDING_TERMS_PATH,
  PHONE_DIGIT_COUNT,
} from "@/features/auth/constants/auth";
import {
  formatPhoneNumber,
  toPhoneDigits,
} from "@/features/auth/utils/formatPhoneNumber";
import {
  type OnboardingLocationState,
  readOnboardingState,
} from "@/features/auth/utils/onboardingState";

// Figma: 온보딩 1 - 전번 (nodeId 3658:112625) — 화면설계서(3747:74298) 1~3번.
// 인삿말에 K-CONNECT가 알려 준 이름을 넣고, 숫자만 입력해도 하이픈이 자동으로 들어간다.
// 11자리를 모두 입력해야 `다음`이 켜진다.
function AuthOnboardingPhoneScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingState = readOnboardingState(location.state);
  // 뒤로 갔다가 다시 와도(히스토리 항목에 남은 값) 입력해 둔 번호가 유지되게 state에서 시작한다
  const [digits, setDigits] = useState(() =>
    toPhoneDigits(onboardingState?.phone ?? ""),
  );

  // 이 화면으로 바로 들어오면(딥링크·새로고침) 뒤로 갈 히스토리가 없어서 navigate(-1)이 아무 일도
  // 하지 않는다 — 그럴 땐 로그인으로 보낸다(다른 화면의 goBack과 같은 규칙).
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(AUTH_LOGIN_PATH, { replace: true });
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  // 로그인을 거치지 않았으면(이름을 모르면) 처음부터 다시 시작한다
  if (!onboardingState) {
    return <Navigate replace to={AUTH_LOGIN_PATH} />;
  }

  const canGoNext = digits.length === PHONE_DIGIT_COUNT;

  const handleNext = () => {
    navigate(AUTH_ONBOARDING_TERMS_PATH, {
      state: {
        name: onboardingState.name,
        phone: digits,
      } satisfies OnboardingLocationState,
      viewTransition: true,
    });
  };

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-2 px-5 pt-3">
        <AuthOnboardingHeading step="1 / 2">
          <span className="block">{onboardingState.name} 님, 반가워요!</span>
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
            onChange={(event) => setDigits(toPhoneDigits(event.target.value))}
            placeholder="ex) 010-1234-5677"
            type="tel"
            value={formatPhoneNumber(digits)}
            width="100%"
          />
        </div>
      </div>

      <div className="shrink-0">
        {/* WDS ActionAreaButton은 세로 padding 12px(48px)인데 Figma Main Action은 16px(56px)이라 맞춘다 */}
        <ActionArea>
          <ActionAreaButton
            disabled={!canGoNext}
            onClick={handleNext}
            sx={{ paddingBlock: "16px" }}
          >
            다음
          </ActionAreaButton>
        </ActionArea>
        {/* ActionArea 아래 padding 20px + 14px = Figma Bottom Safe Area 34px */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default AuthOnboardingPhoneScreen;
