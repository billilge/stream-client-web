import { useNavigate } from "react-router-dom";

import { ACCOUNT_EXIT_PATH } from "@/features/settings/constants/settings";
import { clearAccessToken } from "@/shared/api";
import { clearLoggedIn } from "@/shared/entities/auth/session";

// 로그아웃 확정과 회원 탈퇴 완료는 "계정에서 나가기"라는 같은 동작이라 한곳에 둔다 —
// 두 화면이 각자 navigate를 들고 있으면 세션 정리를 붙일 때 한쪽을 빠뜨리기 쉽다
// (사물함 신청의 useLockersApplySubmit과 같은 이유).
// 로그인 표시(`stream:auth:logged-in`)를 지워야 한다 — 안 지우면 AuthEntryGate를 그냥 통과해서
// 떠난 계정으로 화면이 그대로 열린다. 액세스 토큰도 함께 지운다(서버에 로그아웃·탈퇴 API가 붙으면 그 호출도 이 훅에 같이 붙인다).
export function useAccountExit() {
  const navigate = useNavigate();

  return () => {
    clearLoggedIn();
    clearAccessToken();
    // 떠난 계정 화면으로 뒤로가기로 돌아오지 않게 히스토리를 치환한다
    navigate(ACCOUNT_EXIT_PATH, { replace: true });
  };
}
