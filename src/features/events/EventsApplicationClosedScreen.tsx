import { useNavigate } from "react-router-dom";

import documentLock from "@/assets/icons/common/document-lock.svg";
import ResultScreen from "@/components/ui/ResultScreen";

// Figma: 행사 신청 중 마감됨 (nodeId 1133:43431)
// 제출하는 사이에 인원이 다 찬 경우다 — 신청 결과 화면이라 신청서로는 돌아가지 않는다.
function EventsApplicationClosedScreen() {
  const navigate = useNavigate();

  return (
    <ResultScreen
      description="다음 행사에서 만나요!"
      illustration={
        <img alt="" className="h-[72.317px] w-[62.963px]" src={documentLock} />
      }
      onClose={() => navigate("/")}
      primaryAction={{ label: "홈으로 가기", onClick: () => navigate("/") }}
      title="신청 인원이 모두 찼어요"
    />
  );
}

export default EventsApplicationClosedScreen;
