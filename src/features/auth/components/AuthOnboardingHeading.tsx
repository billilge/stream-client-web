import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

interface AuthOnboardingHeadingProps {
  /** "1 / 2"처럼 전체 단계 중 현재 단계(페이지 인디케이터, 화면설계서 2·5번) */
  step: string;
  /** 줄바꿈이 있는 제목은 줄마다 요소로 넘긴다 */
  children: ReactNode;
}

// Figma: Onboarding Copy (nodeId 3658:112629) — 단계 표시 + 제목(Heading 1/Bold 22px).
function AuthOnboardingHeading({ step, children }: AuthOnboardingHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="caption1"
        weight="medium"
      >
        {step}
      </Typography>
      <Typography
        as="h1"
        color="semantic.label.strong"
        variant="heading1"
        weight="bold"
      >
        {children}
      </Typography>
    </div>
  );
}

export default AuthOnboardingHeading;
