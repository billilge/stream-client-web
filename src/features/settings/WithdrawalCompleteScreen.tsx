import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";

// 탈퇴하면 로그아웃된 상태라 로그인/온보딩으로 나가야 하지만 아직 그 화면이 없다 —
// 인증을 붙일 때 이 상수만 바꾼다. 그때까지는 다른 결과 화면과 같이 홈으로 내보낸다.
const EXIT_PATH = "/";

// Figma: 탈퇴 완료 페이지 (nodeId 3524:152505)
// 신청 결과 화면과 같은 뼈대라 ResultScreen을 쓴다. 버튼이 "확인" 하나뿐이라
// secondaryAction을 주지 않고, 체크 모션이 붙는 완료 화면이라 간격은 8px이다.
function WithdrawalCompleteScreen() {
  const navigate = useNavigate();
  const exit = () => navigate(EXIT_PATH, { replace: true });

  return (
    <ResultScreen
      description="그동안 stream과 함께해 주셔서 감사해요."
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={exit}
      primaryAction={{ label: "확인", onClick: exit }}
      title="회원 탈퇴가 완료되었어요"
    />
  );
}

export default WithdrawalCompleteScreen;
