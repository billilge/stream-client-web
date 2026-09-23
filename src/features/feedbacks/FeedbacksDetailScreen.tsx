import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import {
  Fragment,
  type UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import answerIcon from "@/assets/icons/feedbacks/answer.svg";
import questionIcon from "@/assets/icons/feedbacks/question.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { FEEDBACKS } from "@/features/feedbacks/constants/feedbacks";

// 답변 텍스트의 **강조** 구간을 볼드 Typography로 바꿔 그린다(Figma nodeId 1410:50009의
// 인라인 볼드 스팬). 문단 구분(\n\n)은 별도 파싱 없이 부모의 white-space: pre-wrap에 맡긴다.
function renderAnswerText(text: string, idPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((segment, index) => {
    const key = `${idPrefix}-${index}`;
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <Typography as="span" key={key} variant="body2-reading" weight="bold">
          {segment.slice(2, -2)}
        </Typography>
      );
    }
    return <Fragment key={key}>{segment}</Fragment>;
  });
}

// Figma: 열린피드백 상세페이지 (nodeId 1410:49988)
// 제목·진행 바는 같은 회차(round)의 답변된 피드백들을 한데 묶어 보여준다는 뜻에서
// "N차 피드백 모아보기"다. 같은 회차 안에서 가로로 넘기면(스와이프) 문항이 바뀌고,
// 진행 바의 파란 칸이 그 스크롤 위치를 그대로 따라간다.
// 질문/답변 아이콘은 Q&A 카드와 같은 SVG(question.svg/answer.svg)를 재사용하지만, 이 화면은
// Figma에서 그 아이콘 뒤에 32×32 #F7F7F8(bg-background-alternative) 배경 원이 하나 더 있다
// (download_assets로 확인 — 카드 쪽엔 이 배경 원이 없다). 아이콘 자체 크기도 원 안에서
// 원래 비율대로(각 5/4) 가운데 정렬한다 — size-8로 그대로 채우면 커 보이는 문제는 카드와 같다.
function FeedbacksDetailScreen() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);

  const feedback = FEEDBACKS.find((item) => item.id === feedbackId);
  // 답변이 없는 피드백은 이 화면에 답변 섹션을 그릴 수 없어서 애초에 묶음에서 뺀다
  // (목록 카드도 답변이 있을 때만 이 화면으로 링크한다).
  const roundFeedbacks = useMemo(
    () =>
      feedback
        ? FEEDBACKS.filter(
            (item) => item.round === feedback.round && item.answer,
          )
        : [],
    [feedback],
  );
  const initialIndex = Math.max(
    roundFeedbacks.findIndex((item) => item.id === feedbackId),
    0,
  );
  const [progress, setProgress] = useState(
    roundFeedbacks.length > 1 ? initialIndex / (roundFeedbacks.length - 1) : 0,
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 카드에서 클릭한 항목이 맨 처음 보이도록, 그 항목 위치로 스크롤을 맞춘다
  // (부드럽게 넘기지 않는다 — 화면 진입 시점의 초기 위치 지정이라서).
  useEffect(() => {
    const el = trackRef.current;
    if (!el || el.offsetWidth === 0 || initialIndex === 0) {
      return;
    }
    el.scrollLeft = initialIndex * el.offsetWidth;
  }, [initialIndex]);

  // 스크롤 위치를 0~1 연속값으로 추적한다 — 정수 페이지 단위로 반올림하지 않아서,
  // 스와이프하는 동안 진행 바가 손가락을 따라 매끄럽게 같이 움직인다.
  // currentIndex는 별도로 반올림해서 추적한다 — 이전/다음 버튼의 비활성화 기준, 다음 이동 위치 계산에 쓴다.
  const handleTrackScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const maxScrollLeft = scrollWidth - clientWidth;
    setProgress(maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0);
    if (clientWidth > 0) {
      setCurrentIndex(Math.round(scrollLeft / clientWidth));
    }
  };

  // 이전/다음 버튼은 한 장만큼 프로그래밍적으로 스크롤한다 — 스와이프와 같은 스냅 위치로 맞춰진다.
  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el || el.offsetWidth === 0) {
      return;
    }
    el.scrollTo({ behavior: "smooth", left: index * el.offsetWidth });
  };

  useScreenHeader(
    <ScreenHeader
      title={feedback ? `${feedback.round} 피드백 모아보기` : undefined}
      trailing={
        <TopNavigationButton
          aria-label="닫기"
          onClick={() => navigate("/feedbacks")}
          variant="icon"
        >
          <IconClose />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  if (!feedback) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          존재하지 않는 피드백이에요
        </Typography>
      </div>
    );
  }

  const itemCount = roundFeedbacks.length;
  const hasMultipleItems = itemCount > 1;
  const thumbWidthPercent = 100 / itemCount;
  const thumbLeftPercent = progress * (100 - thumbWidthPercent);

  return (
    <div className="flex h-full flex-col bg-background-normal">
      <div className="shrink-0 px-5 py-2">
        <div className="relative h-1 w-full rounded-full bg-background-alternative">
          <div
            className="absolute h-1 rounded-full bg-progress-fill"
            style={{
              left: `${thumbLeftPercent}%`,
              width: `${thumbWidthPercent}%`,
            }}
          />
        </div>
      </div>

      <div
        className="scrollbar-hidden mt-3 flex flex-1 snap-x snap-mandatory overflow-x-auto"
        onScroll={hasMultipleItems ? handleTrackScroll : undefined}
        ref={trackRef}
      >
        {roundFeedbacks.map((item) => (
          <div
            className="scrollbar-hidden h-full w-full shrink-0 snap-start overflow-y-auto"
            key={item.id}
          >
            <div className="flex flex-col gap-3 px-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-alternative">
                  <img alt="" className="size-5" src={questionIcon} />
                </div>
                <Typography
                  color="semantic.label.neutral"
                  variant="label2"
                  weight="medium"
                >
                  피드백 내용
                </Typography>
              </div>
              <Typography
                as="p"
                color="semantic.label.normal"
                variant="body2-reading"
                weight="medium"
              >
                {item.question}
              </Typography>
            </div>

            <div className="my-6 h-2 w-full bg-background-alternative" />

            {item.answer && (
              <div className="flex flex-col gap-3 px-5 pb-8">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-alternative">
                    <img alt="" className="size-4" src={answerIcon} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <Typography
                      color="semantic.label.neutral"
                      variant="label2"
                      weight="medium"
                    >
                      학생회 답변
                    </Typography>
                    <Typography
                      color="semantic.label.alternative"
                      variant="caption2"
                      weight="regular"
                    >
                      {item.answerDate}
                    </Typography>
                  </div>
                </div>
                <Typography
                  as="p"
                  color="semantic.label.normal"
                  sx={{ whiteSpace: "pre-wrap" }}
                  variant="body2-reading"
                  weight="regular"
                >
                  {renderAnswerText(item.answer, item.id)}
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="shrink-0">
        {/* 버튼 둘을 가로 반반 두는 ActionArea 패턴은 그대로 두고, 회차 내 이전/다음 문항으로
            넘기는 버튼으로 바꿨다(화면설계서 기준) — "이전"만 solid×assistive로 색을 덮는다. */}
        <ActionArea variant="neutral">
          <ActionAreaButton
            buttonColor="assistive"
            buttonVariant="solid"
            disabled={currentIndex === 0}
            onClick={() => scrollToIndex(currentIndex - 1)}
            sx={{ padding: "16px 28px" }}
            variant="alternative"
          >
            이전
          </ActionAreaButton>
          <ActionAreaButton
            disabled={currentIndex === itemCount - 1}
            onClick={() => scrollToIndex(currentIndex + 1)}
            sx={{ padding: "16px 28px" }}
          >
            다음
          </ActionAreaButton>
        </ActionArea>
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default FeedbacksDetailScreen;
