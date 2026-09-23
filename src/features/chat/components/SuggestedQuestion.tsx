import { Typography } from "@wanteddev/wds";

import sparkleIcon from "@/assets/icons/chat/sparkle.svg";

interface SuggestedQuestionProps {
  question: string;
  onClick?: () => void;
}

// Figma: 챗봇 진입 화면의 Suggested Question(nodeId 139:2612) — 클릭하면 그 질문을 그대로
// 챗봇에 보내는 동작이라 div가 아니라 button으로 구현한다.
// 아이콘은 보라→파랑 그라데이션 fill(#8567FF → #6075FF)이라 WDS `IconSparkleFill`(currentColor
// 단색)과 다르다 — Stream 전용 에셋으로 다운로드해 그대로 쓴다.
function SuggestedQuestion({ question, onClick }: SuggestedQuestionProps) {
  return (
    <button
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-solid-alternative p-3"
      onClick={onClick}
      type="button"
    >
      <img alt="" className="size-5 shrink-0" src={sparkleIcon} />
      <Typography
        color="semantic.label.normal"
        variant="label1"
        weight="medium"
      >
        {question}
      </Typography>
    </button>
  );
}

export default SuggestedQuestion;
