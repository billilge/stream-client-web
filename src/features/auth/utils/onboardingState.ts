// 온보딩 단계 사이에 navigate state로 넘기는 값 — 로그인에서 받은 이름과 1단계에서 입력한 연락처다.
// 히스토리 항목에 붙어 있어서 약관 상세에서 돌아와도 유지된다.
export interface OnboardingLocationState {
  name: string;
  phone?: string;
}

export function readOnboardingState(
  state: unknown,
): OnboardingLocationState | null {
  if (
    typeof state === "object" &&
    state !== null &&
    "name" in state &&
    typeof state.name === "string"
  ) {
    return {
      name: state.name,
      phone:
        "phone" in state && typeof state.phone === "string"
          ? state.phone
          : undefined,
    };
  }
  return null;
}
