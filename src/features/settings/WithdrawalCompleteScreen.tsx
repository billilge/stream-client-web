import { Navigate, useLocation } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import { HOME_PATH } from "@/constants/paths";
import { useAccountExit } from "@/features/settings/hooks/useAccountExit";
import type { WithdrawalCompleteState } from "@/features/settings/types";

// Figma: 탈퇴 완료 페이지 (nodeId 3524:152505)
// 신청 결과 화면과 같은 뼈대라 ResultScreen을 쓴다. 버튼이 "확인" 하나뿐이라
// secondaryAction을 주지 않고, 체크 모션이 붙는 완료 화면이라 간격은 8px이다.
// 나갈 곳은 로그아웃과 같은 자리라 useAccountExit를 함께 쓴다.
function WithdrawalCompleteScreen() {
  const exitAccount = useAccountExit();
  const state = useLocation().state as WithdrawalCompleteState | null;

  // 탈퇴 직후에만 오는 화면이라, 주소로 바로 들어오면 홈으로 보낸다(사물함 신청 완료와 같은 처리).
  //
  // 다만 이건 **화면을 가리는 것뿐이고 탈퇴 여부를 확인하는 게 아니다** — navigate state는
  // 클라이언트가 만드는 값이라 마음먹으면 꾸밀 수 있다. 실제 탈퇴 API가 붙으면 이 화면이
  // 보여 주는 내용 자체는 민감하지 않지만, 뒤이어 붙을 "탈퇴 처리" 호출은 반드시 서버가
  // 세션으로 본인 확인을 해야 한다. 백엔드 연동 때 같이 확인할 것.
  if (!state?.withdrawn) {
    return <Navigate replace to={HOME_PATH} />;
  }

  return (
    <ResultScreen
      description="그동안 stream과 함께해 주셔서 감사해요."
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={exitAccount}
      primaryAction={{ label: "확인", onClick: exitAccount }}
      title="회원 탈퇴가 완료되었어요"
    />
  );
}

export default WithdrawalCompleteScreen;
