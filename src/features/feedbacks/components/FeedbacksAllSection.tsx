import { useSuspenseQuery } from "@tanstack/react-query";
import { Typography } from "@wanteddev/wds";
import { useState, useTransition } from "react";

import FeedbacksAllList from "@/features/feedbacks/components/FeedbacksAllList";
import FeedbacksFilter from "@/features/feedbacks/components/FeedbacksFilter";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011) "전체 피드백" — 제목, 연도·차수 필터, 목록.
// 필터에 쓰는 연도·차수는 서버가 알려 준다: 연도는 답변이 공개된 해 전체, 차수는 고른 연도(전체면 올해)의 공개 회차다.
// 필터를 바꾸면 새 조건의 데이터를 받는데, transition으로 바꿔서 그동안 이 영역이 스켈레톤으로 돌아가지 않고
// 지금 목록을 유지한다(처음 받을 때만 FeedbacksListScreen의 Suspense가 스켈레톤을 보여준다).
function FeedbacksAllSection() {
  const [year, setYear] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const { data: filterOptions } = useSuspenseQuery({
    ...feedbacksQueries.rounds(year),
    select: (data) => ({
      rounds: [...data.rounds].sort((a, b) => a - b),
      years: [...data.years].sort((a, b) => b - a),
    }),
  });

  // 연도 메뉴는 "전체 차수" 칩에 붙어 있어서, 연도를 고르면 그 연도의 모든 차수를 보여준다
  const handleYearChange = (nextYear: number | null) => {
    startTransition(() => {
      setYear(nextYear);
      setRound(null);
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex flex-col gap-3">
        <div className="px-5">
          <Typography
            color="semantic.label.normal"
            variant="headline2"
            weight="bold"
          >
            전체 피드백
          </Typography>
        </div>
        <div className="px-5">
          <FeedbacksFilter
            onRoundChange={(nextRound) =>
              startTransition(() => setRound(nextRound))
            }
            onYearChange={handleYearChange}
            round={round}
            rounds={filterOptions.rounds}
            year={year}
            years={filterOptions.years}
          />
        </div>
      </div>
      <FeedbacksAllList round={round} year={year} />
    </div>
  );
}

export default FeedbacksAllSection;
