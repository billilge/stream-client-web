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

// Figma: 행사 Event List (nodeId 1243:70866) 문구를 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
//
// Figma 목업은 같은 행사명 4개(모집중 1 / 모집예정 1 / 모집종료 2)를 상태만 바꿔 보여주는데,
// 여기서는 모집중을 비우고 모집종료 중복도 하나로 줄였다(모집예정 1 / 모집종료 1).
//
// Empty State(1165:62713)는 Figma가 "모집중" 필터 버전으로만 그려져 있고, 일러스트·문구와
// "아카이빙 둘러보기" 버튼이 그 조합의 스펙이다. 목데이터에 모집중 항목이 있으면 이 화면을
// 아예 볼 수 없어서 모집중을 비웠다. 대신 모집중 상세(1133:42433)는 카드로 진입할 수 없다 —
// 실 API가 붙으면 사라질 제약이고, 지금 확인이 필요하면 아래 항목 하나의 status를 "open"으로
// 되돌리면 된다. 모집예정은 상세 디자인(1156:53992)이 있어 진입 가능하게 남겼다.
export const EVENTS: EventItem[] = [
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
