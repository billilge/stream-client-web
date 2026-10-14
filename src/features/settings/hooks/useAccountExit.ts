import { useNavigate } from "react-router-dom";

import { ACCOUNT_EXIT_PATH } from "@/features/settings/constants/settings";

// 로그아웃 확정과 회원 탈퇴 완료는 "계정에서 나가기"라는 같은 동작이라 한곳에 둔다 —
// 두 화면이 각자 navigate를 들고 있으면 세션 정리를 붙일 때 한쪽을 빠뜨리기 쉽다
// (사물함 신청의 useLockersApplySubmit과 같은 이유).
//
// #110(로그인·온보딩, PR #112)이 들어오면 **이 훅 안에만** 아래 둘을 붙이면 된다.
//   1. 세션 표시(`stream:auth:logged-in`) 지우기 — 안 지우면 AuthEntryGate를 그냥 통과해서
//      탈퇴·로그아웃 뒤에도 홈이 그대로 보인다
//   2. ACCOUNT_EXIT_PATH를 "/auth"로 바꾸기
// #112의 entities/auth/session.ts에는 아직 표시를 지우는 함수가 없어서 거기에 추가가 필요하다.
export function useAccountExit() {
  const navigate = useNavigate();

  // 떠난 계정 화면으로 뒤로가기로 돌아오지 않게 히스토리를 치환한다
  return () => navigate(ACCOUNT_EXIT_PATH, { replace: true });
}
