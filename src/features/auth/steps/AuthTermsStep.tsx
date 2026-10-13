import { Divider } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthBottomAction from "@/features/auth/components/AuthBottomAction";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import AuthTermsAgreementRow from "@/features/auth/components/AuthTermsAgreementRow";
import {
  TERMS,
  TERMS_IDS,
  type TermsAgreements,
  type TermsId,
} from "@/features/auth/constants/auth";

// 온보딩 2/2 약관 동의 — 화면설계서 4~7번. 필수 약관 2개(서비스 이용약관, 개인정보 수집·이용)에 모두 동의해야 `다음`이
// 켜지고, 선택 약관(알림 수신)은 미동의여도 진행한다. 각 행 오른쪽 화살표는 약관 상세로 간다.
// 전체 동의 ↔ 개별 항목은 연동된다 — 전체를 누르면 세 항목을 같은 값으로 맞추고, 전체는 따로 저장하지 않고
// 세 항목이 모두 켜졌는지로 파생한다.
function AuthTermsStep({
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
    <ScreenHeader
      leading={<AuthBackButton onClick={onBack} />}
      variant="normal"
    />,
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

      <AuthBottomAction
        disabled={!isRequiredAgreed || isSubmitting}
        label="다음"
        onClick={handleComplete}
      />
    </div>
  );
}

export default AuthTermsStep;
