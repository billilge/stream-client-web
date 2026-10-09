import {
  ActionArea,
  ActionAreaButton,
  Divider,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { submitOnboarding } from "@/entities/auth/authApi";
import { markLoggedIn } from "@/entities/auth/session";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import AuthTermsAgreementRow from "@/features/auth/components/AuthTermsAgreementRow";
import {
  AUTH_LOGIN_PATH,
  AUTH_ONBOARDING_COMPLETE_PATH,
  AUTH_ONBOARDING_PHONE_PATH,
  getTermsDetailPath,
  TERMS,
  TERMS_IDS,
} from "@/features/auth/constants/auth";
import {
  resetOnboardingAgreements,
  useOnboardingAgreements,
} from "@/features/auth/hooks/useOnboardingAgreements";
import { readOnboardingState } from "@/features/auth/utils/onboardingState";

// Figma: 온보딩 2 - 약관동의 (nodeId 3658:112638) — 화면설계서(3747:74298) 4~7번.
// 필수 약관 2개(서비스 이용약관, 개인정보 수집·이용)에 모두 동의해야 `다음`이 켜지고, 선택 약관(알림 수신)은
// 미동의여도 진행한다. 각 행 오른쪽 화살표는 약관 상세로 간다.
function AuthOnboardingTermsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingState = readOnboardingState(location.state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { agreements, isAllAgreed, isRequiredAgreed, toggleAll, toggleOne } =
    useOnboardingAgreements();

  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(AUTH_ONBOARDING_PHONE_PATH, {
      replace: true,
      state: location.state,
    });
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

  // 연락처 단계를 거치지 않았으면 처음부터 다시 시작한다
  if (!onboardingState?.phone) {
    return <Navigate replace to={AUTH_LOGIN_PATH} />;
  }
  const { name, phone } = onboardingState;

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await submitOnboarding({
        hasAgreedNotifications: agreements.notifications,
        name,
        phone,
      });
      markLoggedIn();
      resetOnboardingAgreements();
      // 가입을 마치면 온보딩으로 돌아올 일이 없어서 히스토리를 대체한다
      navigate(AUTH_ONBOARDING_COMPLETE_PATH, { replace: true });
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
            onCheckedChange={toggleAll}
          />
          <Divider color="semantic.line.normal.normal" />
          {TERMS_IDS.map((id) => (
            <AuthTermsAgreementRow
              checked={agreements[id]}
              key={id}
              label={`[${TERMS[id].isRequired ? "필수" : "선택"}] ${TERMS[id].label}`}
              onCheckedChange={(checked) => toggleOne(id, checked)}
              onOpenDetail={() =>
                navigate(getTermsDetailPath(id), { viewTransition: true })
              }
            />
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <ActionArea>
          <ActionAreaButton
            disabled={!isRequiredAgreed || isSubmitting}
            onClick={handleNext}
            sx={{ paddingBlock: "16px" }}
          >
            다음
          </ActionAreaButton>
        </ActionArea>
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default AuthOnboardingTermsScreen;
