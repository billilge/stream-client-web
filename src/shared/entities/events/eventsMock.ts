import type {
  EventListItem,
  EventsQuestion,
  MyEventApplication,
} from "@/shared/entities/events/eventsTypes";

// 행사 화면은 실 API로 받는다. 이 목록은 아직 목데이터로 도는 검색(searchQueries)만 쓴다 — 검색 API를 붙일 때 지운다.
// 행사 목록 응답(EventListItem) 모양이고, Figma 행사 Event List(1243:70866)처럼 같은 행사명에 모집 상태만 다르다.
export const EVENTS: EventListItem[] = [
  {
    applyEndAt: "2026-06-03T23:59:00",
    applyStartAt: "2026-05-25T10:00:00",
    daysUntilDeadline: 2,
    eventId: 1,
    eventStartAt: "2026-06-04T18:30:00",
    recruitStatus: "OPEN",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
  {
    applyEndAt: "2026-06-03T23:59:00",
    applyStartAt: "2026-05-25T10:00:00",
    daysUntilDeadline: null,
    eventId: 2,
    eventStartAt: "2026-06-04T18:30:00",
    recruitStatus: "CLOSED",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
  {
    applyEndAt: "2026-08-20T23:59:00",
    applyStartAt: "2026-08-10T10:00:00",
    daysUntilDeadline: null,
    eventId: 3,
    eventStartAt: "2026-08-28T18:30:00",
    recruitStatus: "BEFORE_OPEN",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
];

// Figma: 행사 신청내역 (nodeId 1133:46168 목록, 1133:46181 상세, 1133:46216 신청취소 상세)
// 행사 상세로 이동할 수 있게 eventId는 위 EVENTS에 있는 행사로 맞춘다.

// 신청 폼(EVENTS_APPLICATION)과 같은 문항 — 신청 당시 문항을 그대로 들고 있는 모양을 흉내 낸다.
const QUESTIONS: EventsQuestion[] = [
  {
    hasOtherOption: true,
    id: "interest",
    isRequired: true,
    options: ["개발", "디자인", "기획"],
    title: "관심 분야를 선택해 주세요.",
    type: "multipleChoice",
  },
  {
    id: "afterParty",
    isRequired: true,
    options: ["참여해요", "참여하지 않아요"],
    title: "뒤풀이에 참여하시나요?",
    type: "singleChoice",
  },
  {
    id: "question",
    isRequired: false,
    title: "궁금한 점이 있다면 자유롭게 남겨 주세요.",
    type: "longAnswer",
  },
];

const APPLICATIONS: MyEventApplication[] = [
  {
    answers: {
      afterParty: "참여해요",
      interest: { otherText: "", selected: ["개발", "디자인"] },
      question:
        "궁금한 점이 하나 있습니다. 행사 당일 학생증을 꼭 챙겨야 하나요?",
    },
    appliedAt: "2026-06-04T13:00",
    cancelledAt: null,
    eventDateTime: "2026-06-04T18:30",
    eventId: "sw-sports-day-closed",
    eventTitle: "소프트웨어융합대학 체육대회",
    id: "application-1",
    location: "미래관 4층 신관 입구",
    questions: QUESTIONS,
    status: "applied",
  },
  {
    answers: {
      afterParty: "참여하지 않아요",
      interest: { otherText: "", selected: ["기획"] },
    },
    appliedAt: "2026-06-04T13:00",
    cancelledAt: null,
    eventDateTime: "2026-06-04T18:30",
    eventId: "sw-sports-day-upcoming",
    eventTitle: "소프트웨어융합대학 체육대회",
    id: "application-2",
    location: "미래관 4층 신관 입구",
    questions: QUESTIONS,
    status: "applied",
  },
  {
    answers: {
      afterParty: "참여해요",
      interest: { otherText: "", selected: ["개발"] },
    },
    appliedAt: "2026-06-03T11:49",
    cancelledAt: "2026-06-04T13:00",
    eventDateTime: "2026-06-04T18:30",
    eventId: "sw-sports-day-closed",
    eventTitle: "소프트웨어융합대학 체육대회",
    id: "application-3",
    location: "미래관 4층 신관 입구",
    questions: QUESTIONS,
    status: "cancelled",
  },
];

// 상태를 바꿔 신청내역 화면을 확인한다
type MyEventApplicationsMockState = "list" | "empty";
const MY_EVENT_APPLICATIONS_MOCK_STATE: MyEventApplicationsMockState = "list";

// 신청 취소가 이 배열의 항목을 바꾼다(eventsQueries의 useCancelEventApplicationMutation) — 목록·상세에 같이 반영된다.
export const MY_EVENT_APPLICATIONS_MOCK: MyEventApplication[] =
  MY_EVENT_APPLICATIONS_MOCK_STATE === "list" ? APPLICATIONS : [];

// 목데이터 일시 형식("2026-06-04T13:00", 분 단위·현지 시각)으로 바꾼다 — 신청 취소 시각처럼 목에서 새로 만드는
// 값에 쓴다. 화면 표기용이 아니다(표기는 lib/date). 실 API가 붙으면 서버가 시각을 정해 주므로 같이 지운다.
export function toMockDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
