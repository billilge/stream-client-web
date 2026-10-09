import { useSyncExternalStore } from "react";

import { TERMS_IDS, type TermsId } from "@/features/auth/constants/auth";

type Agreements = Record<TermsId, boolean>;

const INITIAL_AGREEMENTS: Agreements = {
  notifications: false,
  privacy: false,
  service: false,
};

// 약관 동의 상태는 약관 목록 화면과 약관 상세 화면(별도 라우트)이 같이 본다 — 상세에서 돌아오면
// 목록 화면이 다시 마운트되므로 컴포넌트 state로는 유지되지 않아서 모듈 단위 저장소에 둔다.
// 설계서 7번: 상세 화면에 들어가거나 확인만 해서는 동의 상태가 바뀌지 않는다.
let agreements: Agreements = INITIAL_AGREEMENTS;
const listeners = new Set<() => void>();

function setAgreements(next: Agreements) {
  agreements = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return agreements;
}

export function resetOnboardingAgreements() {
  setAgreements(INITIAL_AGREEMENTS);
}

// 설계서 4번: 전체 동의 ↔ 개별 항목이 서로 연동된다 — 전체를 누르면 세 항목을 같은 값으로 맞추고,
// 개별 항목이 모두 켜지면 전체가 켜지고 하나라도 꺼지면 전체가 꺼진다(전체는 따로 저장하지 않고 파생한다).
export function useOnboardingAgreements() {
  const current = useSyncExternalStore(subscribe, getSnapshot);

  const isAllAgreed = TERMS_IDS.every((id) => current[id]);
  const isRequiredAgreed = current.service && current.privacy;

  const toggleAll = (checked: boolean) => {
    setAgreements({
      notifications: checked,
      privacy: checked,
      service: checked,
    });
  };

  const toggleOne = (id: TermsId, checked: boolean) => {
    setAgreements({ ...agreements, [id]: checked });
  };

  return {
    agreements: current,
    isAllAgreed,
    isRequiredAgreed,
    toggleAll,
    toggleOne,
  };
}
