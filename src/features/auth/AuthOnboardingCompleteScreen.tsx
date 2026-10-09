import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";

// Figma: 가입완료 (nodeId 3658:112662) — 화면설계서(3747:74298) 8번.
// 체크 로띠가 재생되고, `stream 시작하기` 버튼이나 상단 닫기(X) 버튼 모두 홈으로 보낸다.
// 신청 완료 화면과 같은 뼈대라 공용 ResultScreen을 쓴다.
function AuthOnboardingCompleteScreen() {
  const navigate = useNavigate();
  const goHome = () => navigate("/", { replace: true });

  return (
    <ResultScreen
      description="stream에 오신 걸 환영해요."
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={goHome}
      primaryAction={{ label: "stream 시작하기", onClick: goHome }}
      title="가입을 완료했어요!"
    />
  );
}

export default AuthOnboardingCompleteScreen;
