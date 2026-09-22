import { Divider, Typography } from "@wanteddev/wds";

import answerIcon from "@/assets/icons/feedbacks/answer.svg";
import questionIcon from "@/assets/icons/feedbacks/question.svg";

interface FeedbacksQaCardProps {
  question: string;
  answer: string;
}

// Figma: Q&A Card (nodeId 1410:50022) — Stream 로컬 컴포넌트, WDS 아님.
// Icon/Question·Icon/Answer는 search_design_system 이름 매칭도 없고 get_design_context
// Component descriptions에도 없어서(Icon/Answer는 이미 wds-component-usage.md 제외됨 표에 있음)
// Figma 원본 SVG를 그대로 받아 씀.
// 폭은 캐러셀에서 다음 카드가 41px 엿보이도록 컬럼 폭에 맞춰 잡은 값이다. 폰은 Figma 그대로
// 286px(375 기준), 데스크톱 컬럼(sm 이상, 480px)에서는 391px — 좌우 px-5(40px)와 gap(8px)을
// 빼고 남는 41px이 엿보기가 된다. FeedbacksListScreen은 이 폭을 DOM에서 재서 점을 맞춘다.
function FeedbacksQaCard({ question, answer }: FeedbacksQaCardProps) {
  return (
    <div className="flex w-[286px] shrink-0 flex-col gap-3 rounded-xl bg-background-alternative p-4 sm:w-[391px]">
      <div className="flex items-start gap-2">
        <img alt="" className="size-6 shrink-0" src={questionIcon} />
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
        <img alt="" className="size-6 shrink-0" src={answerIcon} />
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
          {answer}
        </Typography>
      </div>
    </div>
  );
}

export default FeedbacksQaCard;
