import { Divider, Typography } from "@wanteddev/wds";

import answerIcon from "@/assets/icons/feedbacks/answer.svg";
import questionIcon from "@/assets/icons/feedbacks/question.svg";

interface FeedbacksQaCardProps {
  question: string;
  answer: string;
  // 질문·답변 글자 수가 카드마다 달라서 높이가 제각각이었다 — 첫 번째 카드의 실제 높이를
  // 재서 모두에게 min-height로 넘기면, 그 카드를 기준으로 높이가 맞춰진다(그보다 내용이
  // 긴 카드가 있어도 잘리지 않게 min-height를 쓴다).
  height?: number;
}

// Figma: Q&A Card (nodeId 1410:50022) — Stream 로컬 컴포넌트, WDS 아님.
// Icon/Question·Icon/Answer는 search_design_system 이름 매칭도 없고 get_design_context
// Component descriptions에도 없어서(Icon/Answer는 이미 wds-component-usage.md 제외됨 표에 있음)
// Figma 원본 SVG를 그대로 받아 씀.
// 아이콘은 24×24 칸(Figma 인스턴스 프레임) 안에 실제 그려진 도형만큼만 채운다 — 우리가 받은
// SVG는 프레임이 아니라 도형 자체의 타이트한 바운딩(19.9998×19.8093 / 16×16.0012)이라, 칸에
// 그대로 늘려 채우면(예전엔 size-6로 강제) Figma보다 20~50% 크게 보인다(/figma-check 지적).
// 칸 크기(24px, 텍스트와의 32px 오프셋)는 유지하고 아이콘만 칸 안에서 가운데 정렬한다.
// 폭은 캐러셀 한 칸(부모가 이미 한 장만 보이도록 폭을 잡아 준다)에 꽉 채운다 — 한 번에
// 카드 한 장만 보이고 옆 카드가 삐져나오지 않아야 한다(Figma QA nodeId 2849:56863).
// FeedbacksListScreen은 이 폭을 DOM에서 재서 페이지네이션 점을 맞춘다.
function FeedbacksQaCard({ question, answer, height }: FeedbacksQaCardProps) {
  // 상세페이지에서만 쓰는 **볼드** 문법을 미리보기 카드에서는 그대로 노출하지 않는다.
  const plainAnswer = answer.replace(/\*\*/g, "");

  return (
    <div
      className="flex w-full flex-col gap-3 rounded-xl bg-background-alternative p-4"
      style={{ minHeight: height }}
    >
      <div className="flex items-start gap-2">
        <div className="flex size-6 shrink-0 items-center justify-center">
          <img alt="" className="size-5" src={questionIcon} />
        </div>
        <Typography
          color="semantic.label.normal"
          variant="label1"
          weight="medium"
        >
          {question}
        </Typography>
      </div>
      <Divider color="semantic.line.normal.alternative" />
      <div className="flex items-start gap-2">
        <div className="flex size-6 shrink-0 items-center justify-center">
          <img alt="" className="size-4" src={answerIcon} />
        </div>
        <Typography
          color="semantic.label.normal"
          sx={{
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            display: "-webkit-box",
            overflow: "hidden",
          }}
          variant="label1-reading"
          weight="regular"
        >
          {plainAnswer}
        </Typography>
      </div>
    </div>
  );
}

export default FeedbacksQaCard;
