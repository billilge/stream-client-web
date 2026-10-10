import type {
  EventItem,
  EventsQuestion,
  MyEventApplication,
} from "@/entities/events/types";

// Figma 상세(1133:42433 모집중 / 1156:53992 모집예정)의 메타데이터·본문은 목업이라 행사별로 다르지 않다.
// 목록 카드가 같은 행사명 4개를 상태만 바꿔 보여주는 것과 같은 이유로, 상세 내용도 공통 상수로 두고
// 상태별로 갈리는 값(뱃지 문구, CTA 문구)만 항목마다 다르게 준다.
const MOCK_SCHEDULE = "4월 15일 (수) 18:30 ~";
const MOCK_LOCATION = "미래관 4층 신관 입구 (예대 방면)";
const MOCK_AUDIENCE = ["소프트웨어융합대학 과학생회비 납부자", "선착순 150명"];
const MOCK_DESCRIPTION = `안녕하십니까, 제10대 소프트웨어융합대학 학생회 ‘에코’입니다.

기말고사를 준비하고 계신 학우 여러분을 응원하기 위해 간식행사를 진행합니다 🍱✨

시험기간 동안 든든하게 힘내시길 바라며, 많은 관심과 참여 부탁드립니다!

📌 간식행사 일정
▪️ 일시 : 6월 1일 (월) 11:00 ~
▪️ 장소 : 미래관 4층 신관 입구 (예대방면)

📌 대상
▪️ 소프트웨어융합대학 재학생 선착순 180명
※ 과학생회비 미납부자 참여 가능

📌 간식행사 메뉴
▪️ 돈까스 도련님 도시락
▪️ 나랑드사이다 제로

📌 유의 사항
▪️ 소프트웨어융합대학 학생임을 증명할 수 있는 모바일 학생증 혹은 실물 학생증을 지참해주시기 바랍니다.
▪️ 1인당 1세트만 수령 가능하며, 선착순 수량 소진 시 수령이 불가능합니다.

많은 학우 여러분의 관심과 참여 부탁드립니다.
감사합니다 😊`;

// Figma: 행사 Event List (nodeId 1243:70866) 문구를 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
//
// Figma 목업은 같은 행사명 4개(모집중 1 / 모집예정 1 / 모집종료 2)를 상태만 바꿔 보여주는데,
// 여기서는 모집종료 중복을 하나로 줄였다(모집중 1 / 모집예정 1 / 모집종료 1).
//
// 모집중은 홈 신청 카드가 가리키는 행사라 남겨 둔다(#114). 그래서 모집중 필터의 Empty State(1165:62713,
// "아카이빙 둘러보기" 버튼)는 아래 모집중 항목을 빼야 볼 수 있다.
export const EVENTS: EventItem[] = [
  {
    actionLabel: "신청하기",
    audience: MOCK_AUDIENCE,
    description: MOCK_DESCRIPTION,
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-open",
    imageCount: 7,
    location: MOCK_LOCATION,
    schedule: MOCK_SCHEDULE,
    status: "open",
    statusLabel: "신청마감 D-2",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "모집종료",
    audience: MOCK_AUDIENCE,
    description: MOCK_DESCRIPTION,
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-closed",
    imageCount: 7,
    location: MOCK_LOCATION,
    schedule: MOCK_SCHEDULE,
    status: "closed",
    statusLabel: "모집종료",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "8월 10일 오픈",
    audience: MOCK_AUDIENCE,
    description: MOCK_DESCRIPTION,
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-upcoming",
    imageCount: 7,
    location: MOCK_LOCATION,
    schedule: MOCK_SCHEDULE,
    status: "upcoming",
    statusLabel: "모집예정",
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

// 신청 취소가 이 배열의 항목을 바꾼다(eventsApi의 cancelMyEventApplication) — 목록·상세에 같이 반영된다.
export const MY_EVENT_APPLICATIONS_MOCK: MyEventApplication[] =
  MY_EVENT_APPLICATIONS_MOCK_STATE === "list" ? APPLICATIONS : [];
