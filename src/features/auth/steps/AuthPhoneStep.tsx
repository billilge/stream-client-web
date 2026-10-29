import { TextField, Typography } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import AuthBackButton from "@/features/auth/components/AuthBackButton";
import AuthBottomAction from "@/features/auth/components/AuthBottomAction";
import AuthOnboardingHeading from "@/features/auth/components/AuthOnboardingHeading";
import {
  formatPhoneNumber,
  isValidPhoneDigits,
  toPhoneDigits,
} from "@/features/auth/utils/formatPhoneNumber";

// 온보딩 1/2 연락처 — 화면설계서(3747:74298) 1~3번. 인삿말에 K-CONNECT가 알려 준 이름을 넣고, 숫자만 입력해도
// 하이픈이 자동으로 들어간다. 010으로 시작하는 11자리를 모두 입력해야 `다음`이 켜진다.
function AuthPhoneStep({
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
    <ScreenHeader
      leading={<AuthBackButton onClick={onBack} />}
      variant="normal"
    />,
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

      <AuthBottomAction
        disabled={!isValidPhoneDigits(digits)}
        label="다음"
        onClick={() => onNext(digits)}
      />
    </div>
  );
}

export default AuthPhoneStep;
