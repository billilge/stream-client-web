import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";

// Figma: 송금 확인요청 완료 페이지 (nodeId 3562:163013)
// 체크 모션이 신청 완료 화면들과 같은 메인 컴포넌트(Circle Check Motion 1712:192849)의
// 인스턴스라 ResultScreen + CompleteCheck를 그대로 쓴다. 버튼이 하나뿐이라 secondaryAction은 없다.
function FeeTransferCompleteScreen() {
  const navigate = useNavigate();
  const goHome = () => navigate("/", { replace: true });

  return (
    <ResultScreen
      description={
        "학생회에서 3일 이내에 입금 여부를\n확인한 뒤 알려 드릴게요."
      }
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={goHome}
      primaryAction={{ label: "홈으로 가기", onClick: goHome }}
      title="송금 확인을 요청했어요"
    />
  );
}

export default FeeTransferCompleteScreen;
