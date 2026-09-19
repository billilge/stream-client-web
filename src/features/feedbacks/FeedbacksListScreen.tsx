import {
  Divider,
  PaginationDots,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconPlus, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksCard from "@/features/feedbacks/components/FeedbacksCard";
import FeedbacksQaCard from "@/features/feedbacks/components/FeedbacksQaCard";
import {
  FEEDBACK_ROUND_FILTERS,
  FEEDBACKS,
} from "@/features/feedbacks/constants/feedbacks";

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011)
function FeedbacksListScreen() {
  const navigate = useNavigate();
  const [roundFilter, setRoundFilter] = useState("all");

  // "공지"/"열린피드백" 토글은 게시판-공지 화면과 같은 ScreenHeaderToggleTitle을 쓴다. 이제
  // 두 화면이 다 있어서 클릭하면 실제로 이동하도록 onChange를 연결한다(공지 쪽도 함께 연결).
  useScreenHeader(
    <ScreenHeader
      title={{
        activeIndex: 1,
        onChange: (index) => navigate(index === 0 ? "/notices" : "/feedbacks"),
        options: ["공지", "열린피드백"],
      }}
      trailing={
        <>
          <TopNavigationButton aria-label="검색" variant="icon">
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  const answeredFeedbacks = FEEDBACKS.filter((feedback) => feedback.answer);
  const feedbacks = FEEDBACKS.filter(
    (feedback) => roundFilter === "all" || feedback.round === roundFilter,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 px-5 pt-2">
          <Typography
            color="semantic.label.normal"
            variant="headline2"
            weight="bold"
          >
            최근 피드백
          </Typography>
          <div className="flex flex-col items-center gap-4">
            <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto">
              {answeredFeedbacks.map((feedback) => (
                <FeedbacksQaCard
                  answer={feedback.answer ?? ""}
                  key={feedback.id}
                  question={feedback.question}
                />
              ))}
            </div>
            <PaginationDots
              currentPage={1}
              size="small"
              totalPages={answeredFeedbacks.length}
            />
          </div>
        </div>

        <div className="my-8 h-2 w-full bg-background-alternative" />

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
              <FilterChipGroup
                onChange={setRoundFilter}
                options={FEEDBACK_ROUND_FILTERS}
                value={roundFilter}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {feedbacks.map((feedback, index) => (
              <Fragment key={feedback.id}>
                {index > 0 && (
                  <div className="px-5">
                    <Divider color="semantic.line.normal.alternative" />
                  </div>
                )}
                <FeedbacksCard
                  question={feedback.question}
                  round={feedback.round}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 피드백 작성 화면은 이번 범위 밖이라 클릭 동작은 아직 없다 */}
      <button
        aria-label="피드백 작성"
        className="absolute right-5 bottom-5 flex items-center gap-1 rounded-full bg-primary px-4 py-3 shadow-[0px_6px_5px_rgba(23,23,23,0.08),0px_16px_12px_rgba(23,23,23,0.08)]"
        type="button"
      >
        <IconPlus className="size-5 text-white" />
        <Typography color="atomic.common.100" variant="label1" weight="bold">
          피드백 작성
        </Typography>
      </button>
    </div>
  );
}

export default FeedbacksListScreen;
