import { Typography } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import VerificationCodeInput from "@/features/auth/components/VerificationCodeInput";
import {
  EMAIL_CODE_EXPIRED_MESSAGE,
  EMAIL_CODE_EXPIRY_SECONDS,
  EMAIL_CODE_LENGTH,
  EMAIL_CODE_VERIFY_FAILURE_MESSAGE,
  EMAIL_SEND_FAILURE_MESSAGE,
} from "@/features/auth/constants/auth";
import { useCountdown } from "@/features/auth/hooks/useCountdown";
import {
  getEmailCodeErrorMessage,
  getEmailSendErrorMessage,
} from "@/features/auth/utils/emailVerificationErrorMessage";
import { formatCountdown } from "@/features/auth/utils/formatCountdown";
import {
  requestEmailVerification,
  verifyEmailCode,
} from "@/shared/entities/members/membersQueries";

// 온보딩 2/3 인증번호 입력 — Figma 이메일인증 5 (nodeId 4473:48952). 6자리를 모두 채우면 바로 확인하고, 맞으면
// 약관 동의 단계로 간다. `다시 보내기`는 새 인증번호를 보내면서 5분 타이머를 처음부터 센다.
// 타이머는 발송 시각(퍼널 context)부터 세서 새로고침해도 이어지고, 이 화면은 들어올 때 인증번호를 보내지 않는다.
// 단계 표시(2 / 3, 이메일 입력과 같은 단계)와 오류·만료 토스트는 Figma에 없고 더한 것이다.
function AuthEmailCodeStep({
  email,
  codeSentAt,
  onBack,
  onResent,
  onVerified,
}: {
  email: string;
  /** 지금 인증번호를 보낸 시각(ms) — 5분 타이머의 기준이다 */
  codeSentAt: number;
  onBack: () => void;
  /** 다시 보내기에 성공했을 때 새 발송 시각을 퍼널 context에 남긴다 */
  onResent: (sentAt: number) => void;
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  // 같은 문구가 연달아 떠도 스크린리더가 다시 안내하도록 토스트마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);
  const remainingSeconds = useCountdown(
    codeSentAt + EMAIL_CODE_EXPIRY_SECONDS * 1000,
  );

  useScreenHeader(
    <ScreenHeader
      leading={<AuthBackButton onClick={onBack} />}
      variant="normal"
    />,
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
    setToastToken((token) => token + 1);
  };

  const handleComplete = async (completedCode: string) => {
    if (remainingSeconds === 0) {
      setCode("");
      showToast(EMAIL_CODE_EXPIRED_MESSAGE);
      return;
    }
    setIsVerifying(true);
    try {
      await verifyEmailCode(email, completedCode);
    } catch (error) {
      console.warn(EMAIL_CODE_VERIFY_FAILURE_MESSAGE, error);
      setCode("");
      setIsVerifying(false);
      showToast(getEmailCodeErrorMessage(error));
      return;
    }
    setIsVerifying(false);
    onVerified();
  };

  const handleResend = async () => {
    try {
      await requestEmailVerification(email);
    } catch (error) {
      console.warn(EMAIL_SEND_FAILURE_MESSAGE, error);
      showToast(getEmailSendErrorMessage(error));
      return;
    }
    setCode("");
    onResent(Date.now());
  };

  return (
    <div className="flex h-full flex-col bg-background-normal">
      <div className="flex flex-col gap-14 px-5 pt-3">
        <div className="flex flex-col gap-2">
          <AuthOnboardingHeading step="2 / 3">
            <span className="block">이메일로 받은</span>
            <span className="block">인증번호 6자리를 입력해 주세요</span>
          </AuthOnboardingHeading>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            {email}
          </Typography>
        </div>

        <div className="flex flex-col items-center gap-4">
          <VerificationCodeInput
            disabled={isVerifying}
            length={EMAIL_CODE_LENGTH}
            onChange={setCode}
            onComplete={handleComplete}
            value={code}
          />
          <div className="flex items-end gap-3">
            <Typography
              as="span"
              color="semantic.label.alternative"
              variant="body2"
              weight="regular"
            >
              {formatCountdown(remainingSeconds)}
            </Typography>
            <Typography
              as="button"
              className="underline"
              color="semantic.label.alternative"
              disabled={isVerifying}
              onClick={handleResend}
              type="button"
              variant="body2"
              weight="regular"
            >
              다시 보내기
            </Typography>
          </div>
        </div>
      </div>

      <ScreenToast
        key={toastToken}
        message={toastMessage}
        onOpenChange={setToastOpen}
        open={toastOpen}
      />
    </div>
  );
}

export default AuthEmailCodeStep;
