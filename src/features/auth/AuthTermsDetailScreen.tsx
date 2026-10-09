import {
  ActionArea,
  ActionAreaButton,
  Divider,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Fragment } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthTermsSection from "@/features/auth/components/AuthTermsSection";
import {
  AUTH_ONBOARDING_TERMS_PATH,
  isTermsId,
  TERMS,
} from "@/features/auth/constants/auth";

// Figma: 서비스 이용약관 동의 (nodeId 3738:73022), 선택적 정보 알림 수신 동의 (3738:73116),
// 개인정보 수집 및 이용 동의 (3738:73209) — 화면설계서(3747:74298) 7번.
// 하단 `확인했어요`나 뒤로가기는 약관 동의 화면으로 돌아가기만 한다 — 상세를 보거나 확인했다는 것만으로는
// 동의 상태가 바뀌지 않는다.
function AuthTermsDetailScreen() {
  const navigate = useNavigate();
  const { termsId } = useParams();
  const terms = isTermsId(termsId) ? TERMS[termsId] : undefined;

  // 약관 동의 화면을 거치지 않고 바로 들어오면(딥링크) 뒤로 갈 히스토리가 없어 목록으로 보낸다.
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(AUTH_ONBOARDING_TERMS_PATH, { replace: true });
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
      title={terms?.title}
      variant="normal"
    />,
  );

  if (!terms) {
    return <Navigate replace to={AUTH_ONBOARDING_TERMS_PATH} />;
  }

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

      <div className="shrink-0">
        <ActionArea background>
          <ActionAreaButton onClick={goBack} sx={{ paddingBlock: "16px" }}>
            확인했어요
          </ActionAreaButton>
        </ActionArea>
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default AuthTermsDetailScreen;
