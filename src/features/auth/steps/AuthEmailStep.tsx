import { TextField, Typography } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthBottomAction from "@/features/auth/components/AuthBottomAction";
import AuthSignUpHeading from "@/features/auth/components/AuthSignUpHeading";
import { EMAIL_SEND_FAILURE_MESSAGE } from "@/features/auth/constants/auth";
import { getEmailSendErrorMessage } from "@/features/auth/utils/emailVerificationErrorMessage";
import { isValidEmail } from "@/features/auth/utils/isValidEmail";

// 온보딩 2/3 이메일 입력 — Figma 이메일인증 4 (nodeId 4473:48819). 단계 표시(2 / 3)는 Figma에 없고 연락처·약관 화면과 맞춰 더했다.
// 입력칸은 Figma `Textinput/Textfield`(445:8591)라 WDS `TextField`를 쓴다 — 라벨("이메일")은 TextField가 그리지 않아서
// 형제 요소로 따로 그린다(설정의 전화번호 변경과 같다).
function AuthEmailStep({
  initialEmail,
  onBack,
  onChangeEmail,
  onNext,
}: {
  initialEmail: string;
  onBack: () => void;
  /** 입력할 때마다 퍼널 context에 반영한다 — 인증번호 단계에서 뒤로 돌아와도 이메일이 남는다 */
  onChangeEmail: (email: string) => void;
  /** 인증번호를 보내고 다음 단계로 간다. 보내지 못하면 거부해서 이 단계에 머문다 */
  onNext: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  // 발송이 연달아 실패해도 스크린리더가 토스트를 다시 안내하도록 실패마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);

  useScreenHeader(
    <ScreenHeader
      leading={<AuthBackButton onClick={onBack} />}
      variant="normal"
    />,
  );

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      await onNext(email.trim());
    } catch (error) {
      console.warn(EMAIL_SEND_FAILURE_MESSAGE, error);
      setToastMessage(getEmailSendErrorMessage(error));
      setToastOpen(true);
      setToastToken((token) => token + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      <div className="flex flex-col gap-2 px-5 pt-3">
        <AuthSignUpHeading step="2 / 3">이메일을 알려주세요</AuthSignUpHeading>
        <div className="flex flex-col gap-5">
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="body2"
            weight="regular"
          >
            입력하신 이메일로 인증번호를 보내 드려요.
          </Typography>
          <div className="flex flex-col gap-2">
            <Typography
              as="label"
              color="semantic.label.neutral"
              htmlFor="email"
              variant="label1"
              weight="bold"
            >
              이메일
            </Typography>
            <TextField
              autoComplete="email"
              id="email"
              inputMode="email"
              onChange={(event) => {
                setEmail(event.target.value);
                onChangeEmail(event.target.value);
              }}
              placeholder="user@example.com"
              type="email"
              value={email}
              width="100%"
            />
          </div>
        </div>
      </div>

      <AuthBottomAction
        disabled={!isValidEmail(email) || isSubmitting}
        label="인증번호 받기"
        onClick={handleNext}
      />

      <ScreenToast
        key={toastToken}
        message={toastMessage}
        onOpenChange={setToastOpen}
        open={toastOpen}
      />
    </div>
  );
}

export default AuthEmailStep;
