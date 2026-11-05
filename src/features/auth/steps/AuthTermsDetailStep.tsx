import { Divider } from "@wanteddev/wds";
import { Fragment } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthBottomAction from "@/features/auth/components/AuthBottomAction";
import AuthTermsSection from "@/features/auth/components/AuthTermsSection";
import { TERMS } from "@/features/auth/constants/auth";
import type { TermType } from "@/shared/entities/members/membersTypes";

// 약관 상세 — 화면설계서 7번. 하단 `확인했어요`나 뒤로가기는 약관 동의로 돌아가기만 한다 — 상세를 보거나
// 확인했다는 것만으로는 동의 상태가 바뀌지 않는다.
function AuthTermsDetailStep({
  termType,
  onBack,
}: {
  termType: TermType;
  onBack: () => void;
}) {
  const terms = TERMS[termType];

  useScreenHeader(
    <ScreenHeader
      leading={<AuthBackButton onClick={onBack} />}
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

      <AuthBottomAction hasBackground label="확인했어요" onClick={onBack} />
    </div>
  );
}

export default AuthTermsDetailStep;
