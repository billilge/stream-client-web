import { useNavigate } from "react-router-dom";

import { clearLoggedIn } from "@/entities/auth/session";
import { ACCOUNT_EXIT_PATH } from "@/features/settings/constants/settings";

// 로그아웃 확정과 회원 탈퇴 완료는 "계정에서 나가기"라는 같은 동작이라 한곳에 둔다 —
// 두 화면이 각자 navigate를 들고 있으면 세션 정리를 붙일 때 한쪽을 빠뜨리기 쉽다
// (사물함 신청의 useLockersApplySubmit과 같은 이유).
// 로그인 표시(`stream:auth:logged-in`)를 지워야 한다 — 안 지우면 AuthEntryGate를 그냥 통과해서
// 떠난 계정으로 화면이 그대로 열린다. 실 인증이 붙으면 서버 세션 정리도 이 훅에 같이 붙인다.
export function useAccountExit() {
  const navigate = useNavigate();

  return () => {
    clearLoggedIn();
    // 떠난 계정 화면으로 뒤로가기로 돌아오지 않게 히스토리를 치환한다
    navigate(ACCOUNT_EXIT_PATH, { replace: true });
  };
}
