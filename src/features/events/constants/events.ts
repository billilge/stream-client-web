export type EventStatus = "open" | "upcoming" | "closed";

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  status: EventStatus;
  statusLabel: string;
  actionLabel: string;
  /** 상세 상단 Hero 이미지 개수 — 실 이미지 API 전까지 PageCounter 표기용 */
  imageCount: number;
  /** 상세 메타데이터 "일시" */
  schedule: string;
  /** 상세 메타데이터 "장소" */
  location: string;
  /** 상세 메타데이터 "대상" — Figma가 두 줄로 쪼개 보여줘서 줄 단위로 들고 있는다 */
  audience: string[];
  /** 상세 본문. 줄바꿈을 그대로 살려 렌더링한다 */
  description: string;
}

// 모집 상태 필터. value는 EventStatus + "all"이고, 라벨은 Figma Filter Chips(1243:70861) 그대로.
export const EVENT_STATUS_FILTERS = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "open" },
  { label: "모집예정", value: "upcoming" },
  { label: "모집종료", value: "closed" },
] as const;

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

// Figma: 행사 Event List (nodeId 1243:70866) 순서·문구를 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
// Figma는 같은 행사명 4개를 상태만 바꿔 보여주는 목업이라, 상태 3종이 다 나오도록 그대로 뒀다.
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
  {
    actionLabel: "모집종료",
    audience: MOCK_AUDIENCE,
    description: MOCK_DESCRIPTION,
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-closed-1",
    imageCount: 7,
    location: MOCK_LOCATION,
    schedule: MOCK_SCHEDULE,
    status: "closed",
    statusLabel: "모집종료",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "모집종료",
    audience: MOCK_AUDIENCE,
    description: MOCK_DESCRIPTION,
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-closed-2",
    imageCount: 7,
    location: MOCK_LOCATION,
    schedule: MOCK_SCHEDULE,
    status: "closed",
    statusLabel: "모집종료",
    title: "소프트웨어융합대학 체육대회",
  },
];
