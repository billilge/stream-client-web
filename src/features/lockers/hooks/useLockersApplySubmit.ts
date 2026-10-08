import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type LockersApplyRequest,
  type LockersApplySuccess,
  submitLockersApplication,
} from "@/features/lockers/constants/lockersApplySubmit";

// 결과 화면으로 넘기는 값. 히스토리에 저장돼 새로고침해도 남고, 주소로 바로 들어오면 없다.
export interface LockersApplyCompleteState {
  application: LockersApplySuccess;
}

export interface LockersApplyFailureState {
  // 다시 시도할 때 같은 사물함으로 다시 신청한다
  request: LockersApplyRequest;
}

// 사물함을 신청하고 결과에 따라 완료·오류 화면으로 보낸다. 칸 선택 화면과 오류 화면의 `다시 시도`가 같이 쓴다.
// 신청을 마친 화면으로는 돌아가지 않게 결과 화면은 replace로 연다.
export function useLockersApplySubmit(sectionId: string) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 신청 중 화면은 클릭만 막아서 키보드로 버튼을 다시 누를 수 있다 — 진행 중이면 두 번째 신청을 무시한다
  const isSubmittingRef = useRef(false);
  // 신청 중에 기기 뒤로가기로 화면을 떠나면, 늦게 온 응답으로 결과 화면에 끌고 가지 않는다
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const submit = async (request: LockersApplyRequest) => {
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const result = await submitLockersApplication(request);
    isSubmittingRef.current = false;
    if (!isMountedRef.current) {
      return;
    }
    setIsSubmitting(false);

    const basePath = `/lockers/apply/sections/${sectionId}`;
    if (result.type === "success") {
      navigate(`${basePath}/complete`, {
        replace: true,
        state: {
          application: result.application,
        } satisfies LockersApplyCompleteState,
        viewTransition: true,
      });
      return;
    }
    navigate(`${basePath}/failure/${result.reason}`, {
      replace: true,
      state: { request } satisfies LockersApplyFailureState,
      viewTransition: true,
    });
  };

  return { isSubmitting, submit };
}
