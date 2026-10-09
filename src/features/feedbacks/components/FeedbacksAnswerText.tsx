import { Typography } from "@wanteddev/wds";
import { Fragment } from "react";

interface FeedbacksAnswerTextProps {
  text: string;
}

// 학생회 답변 본문 — **강조** 구간을 볼드 Typography로 바꿔 그린다(Figma nodeId 1410:50009의
// 인라인 볼드 스팬). 문단 구분(\n\n)은 별도 파싱 없이 white-space: pre-wrap에 맡긴다.
// 열린피드백 상세와 작성내역 상세가 같이 쓴다.
function FeedbacksAnswerText({ text }: FeedbacksAnswerTextProps) {
  return (
    <Typography
      as="p"
      color="semantic.label.normal"
      sx={{ whiteSpace: "pre-wrap" }}
      variant="body2-reading"
      weight="regular"
    >
      {text.split(/(\*\*[^*]+\*\*)/g).map((segment, index) => {
        // 같은 답변 안에서 순서가 바뀌지 않는 조각이라 위치를 key로 쓴다
        const key = `${index}-${segment}`;
        if (segment.startsWith("**") && segment.endsWith("**")) {
          return (
            <Typography
              as="span"
              key={key}
              variant="body2-reading"
              weight="bold"
            >
              {segment.slice(2, -2)}
            </Typography>
          );
        }
        return <Fragment key={key}>{segment}</Fragment>;
      })}
    </Typography>
  );
}

export default FeedbacksAnswerText;
