import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import documentLock from "@/assets/icons/common/document-lock.svg";
import networkOffline from "@/assets/icons/common/network-offline.svg";
import ResultScreen from "@/components/ui/ResultScreen";

type ErrorScreenVariant = "network" | "server";

interface ErrorScreenContent {
  illustration: ReactNode;
  title: string;
  description: string;
}

// Figma: 네트워크 오류 (nodeId 3013:98926) / 서버 오류 (3013:98947)
// 그림은 둘 다 80×80 틀 안에 있다. 네트워크 SVG는 틀 크기로 잘라 둬서 그대로 놓고,
// 자물쇠 그림(62.96×72.32)은 틀 가운데에 둔다(사물함 신청 실패 화면과 같은 그림·배치).
const ERROR_SCREEN_CONTENTS: Record<ErrorScreenVariant, ErrorScreenContent> = {
  network: {
    description: "연결 상태를 확인한 후 다시 시도해 주세요.",
    illustration: <img alt="" className="size-20" src={networkOffline} />,
    title: "인터넷 연결이 원활하지 않아요",
  },
  server: {
    description: "잠시 후 다시 시도해 주세요.",
    illustration: (
      <div className="flex size-20 items-center justify-center">
        <img alt="" className="h-[72.317px] w-[62.963px]" src={documentLock} />
      </div>
    ),
    title: "일시적인 오류가 발생했어요",
  },
};

interface ErrorScreenProps {
  variant: ErrorScreenVariant;
  /** "다시 시도" — 실패한 요청을 어떻게 다시 할지는 쓰는 쪽이 정한다 */
  onRetry: () => void;
}

// 어느 화면에서든 요청이 실패했을 때 보여주는 공용 오류 화면. 닫기(X)와 "홈으로 가기"는 둘 다 홈으로 보낸다.
// API 연동(#125)이 들어오면 에러 바운더리의 fallback으로 연결한다.
function ErrorScreen({ variant, onRetry }: ErrorScreenProps) {
  const navigate = useNavigate();
  const content = ERROR_SCREEN_CONTENTS[variant];
  const goHome = () => navigate("/");

  return (
    <ResultScreen
      // Figma는 헤더 아래 104px 고정이지만, 긴 화면에서 위로 붙어 보여서 가운데에 둔다
      contentAlign="center"
      description={content.description}
      illustration={content.illustration}
      onClose={goHome}
      primaryAction={{ label: "다시 시도", onClick: onRetry }}
      secondaryAction={{ label: "홈으로 가기", onClick: goHome }}
      title={content.title}
    />
  );
}

export default ErrorScreen;
