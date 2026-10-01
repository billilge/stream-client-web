import type { FilterChipOption } from "@/components/ui/FilterChipGroup";

export type FeedbackRound = "1차" | "2차" | "3차" | "4차";

export interface Feedback {
  id: string;
  question: string;
  round: FeedbackRound;
  answer?: string;
  // 상세페이지(모아보기)의 "학생회 답변" 날짜. 답변이 없으면 의미가 없어 answer와 함께 옵셔널이다.
  answerDate?: string;
}

export const FEEDBACK_ROUND_FILTERS: FilterChipOption[] = [
  { label: "전체", value: "all" },
  { label: "1차", value: "1차" },
  { label: "2차", value: "2차" },
  { label: "3차", value: "3차" },
  { label: "4차", value: "4차" },
];

// 문단은 빈 줄(\n\n)로 나누고, 굵게 강조할 구간은 **텍스트**로 표시한다 — 둘 다 Figma
// 원본(nodeId 1410:50009)의 문단 구분·볼드 스팬을 그대로 옮긴 것이다.
// FeedbacksDetailScreen이 이 문법을 해석해서 렌더링하고, 카드 미리보기(FeedbacksQaCard)는
// **만 지운 평문으로 보여준다.
const MT_ANSWER = [
  "학우 여러분의 경제적 부담을 덜어드리기 위해 더욱 고민하겠습니다. 최근 **지속적인 물가 상승**으로 인해 숙박 및 대관료가 전반적으로 크게 인상된 상황이었습니다.",
  "실제로는 기존보다 참가비가 인상될 수밖에 없는 여건이었으나, 학생회에서는 학우분들의 **부담을 최소화**하기 위해 업체 측과 수차례 협의를 진행하며 최대한 비용을 조정했고, 학교 측 지원금 확보 노력 등을 통해 기존 수준으로 **참가비를 동결**하고자 최선을 다했습니다.",
  "그럼에도 불구하고 학우분들께서 체감하시는 부담을 충분히 줄여드리지 못한 점은 학생회 역시 무겁게 받아들이고 있습니다.",
  "향후 행사에서는 보다 **합리적이고 만족도 높은 행사 운영**이 이루어질 수 있도록 최선을 다하겠습니다.",
].join("\n\n");

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011) 목업 데이터
export const FEEDBACKS: Feedback[] = [
  {
    answer: MT_ANSWER,
    answerDate: "2026-05-06",
    id: "1",
    question: "MT 참가 비용이 다소 비싼 편이라 부담스러웠어요.",
    round: "2차",
  },
  {
    answer:
      "말씀 주신 대로 다음 학기부터는 개강총회를 목요일에 진행해 다음 날 부담을 줄일 수 있도록 반영하겠습니다.",
    answerDate: "2026-05-06",
    id: "2",
    question: "목요일에 개강총회를 진행해서 다음 날 부담이 적어 좋았습니다.",
    round: "2차",
  },
  {
    answer: "건의해주신 내용은 다음 학생회 운영위에서 함께 논의하겠습니다.",
    answerDate: "2026-03-14",
    id: "3",
    question: "동아리방 냉난방기 가동 시간을 조금 더 늘려주시면 좋겠습니다.",
    round: "1차",
  },
  {
    answer: "안내드린 대로 다음 공지에 상세 시간표를 함께 첨부하겠습니다.",
    answerDate: "2026-07-02",
    id: "4",
    question:
      "축제 공연 시간표를 미리 공지해주시면 일정을 맞추기 편할 것 같아요.",
    round: "3차",
  },
  {
    answer: "학생증 재발급 신청 절차를 학과 사무실과 다시 공유드리겠습니다.",
    answerDate: "2026-08-20",
    id: "5",
    question: "학생증 재발급 절차가 헷갈려서 안내가 더 필요해요.",
    round: "4차",
  },
];
