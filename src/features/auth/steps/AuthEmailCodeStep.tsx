import { Typography } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  EmailCodeMismatchError,
  requestEmailVerification,
  verifyEmailCode,
} from "@/entities/auth/authApi";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthCodeInput from "@/features/auth/components/AuthCodeInput";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import {
  EMAIL_CODE_EXPIRED_MESSAGE,
  EMAIL_CODE_EXPIRY_SECONDS,
  EMAIL_CODE_LENGTH,
  EMAIL_CODE_MISMATCH_MESSAGE,
  EMAIL_CODE_VERIFY_FAILURE_MESSAGE,
  EMAIL_SEND_FAILURE_MESSAGE,
} from "@/features/auth/constants/auth";
import { useCountdown } from "@/features/auth/hooks/useCountdown";
import { formatCountdown } from "@/features/auth/utils/formatCountdown";

// 온보딩 1/3 인증번호 입력 — Figma 이메일인증 5 (nodeId 4473:48952). 6자리를 모두 채우면 바로 확인하고, 맞으면
// 연락처 단계로 간다(onVerified). 틀리거나 시간이 지나면 토스트로 알리고 다시 입력받는다. 이메일 입력(AuthEmailStep)과
// 같은 1단계라 단계 표시도 같다(1 / 3, Figma에는 없고 연락처·약관 화면과 맞춰 더했다).
// 인증번호는 5분 안에 입력해야 하고, `다시 보내기`는 새 인증번호를 보내면서 타이머를 처음부터 센다.
// 오류·만료 상태는 Figma에 없어서 같은 토스트(ScreenToast)로 알린다.
function AuthEmailCodeStep({
  email,
  onBack,
  onVerified,
}: {
  email: string;
  onBack: () => void;
  /** 인증번호가 맞았을 때 — 다음 단계로 간다 */
  onVerified: () => void;
}) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  // 같은 문구가 연달아 떠도 스크린리더가 다시 안내하도록 토스트마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);
  const { remainingSeconds, restart } = useCountdown(EMAIL_CODE_EXPIRY_SECONDS);

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
      showToast(
        error instanceof EmailCodeMismatchError
          ? EMAIL_CODE_MISMATCH_MESSAGE
          : EMAIL_CODE_VERIFY_FAILURE_MESSAGE,
      );
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
      showToast(EMAIL_SEND_FAILURE_MESSAGE);
      return;
    }
    setCode("");
    restart();
  };

  return (
    <div className="flex h-full flex-col bg-background-normal">
      <div className="flex flex-col gap-14 px-5 pt-3">
        <div className="flex flex-col gap-2">
          <AuthOnboardingHeading step="1 / 3">
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
          <AuthCodeInput
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
