// 탈퇴 확인 화면이 완료 화면으로 넘기는 값. 완료 화면이 주소로 바로 열리는 걸 막는 표시다
// (사물함 신청의 LockersApplyCompleteState와 같은 방식).
export interface WithdrawalCompleteState {
  withdrawn: true;
}
