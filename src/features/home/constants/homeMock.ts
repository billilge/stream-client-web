import hairDryer from "@/assets/icons/bililge-items/hair-dryer.svg";
import powerBank from "@/assets/icons/bililge-items/power-bank.svg";
import umbrella from "@/assets/icons/bililge-items/umbrella.svg";

// 홈 API가 붙기 전까지 쓰는 목데이터다.
export const HOME_HAS_UNREAD_NOTIFICATION = true;

// 공지 배너 템플릿 — 공지마다 그림을 따로 받지 않고 종류별 그림을 쓴다(Figma 3562:163869)
export type HomeNoticeTemplate =
  | "general"
  | "event"
  | "partnership"
  | "locker"
  | "snack"
  | "feedback";

export interface HomeNotice {
  id: string;
  // 배너를 누르면 여는 공지 상세. 공지가 없을 때의 기본 배너는 열 공지가 없어 비운다
  noticeId?: string;
  template: HomeNoticeTemplate;
  title: string;
  subtitle: string;
}

// 모집 중인 행사·사물함 신청 안내 카드. 행사는 상세·신청 화면으로, 사물함은 사물함 신청으로 간다.
export type HomeApplyCard = {
  id: string;
  title: string;
  daysUntilDeadline: number;
} & ({ kind: "event"; eventId: string } | { kind: "locker" });

export interface HomeRental {
  id: string;
  name: string;
  icon: string;
  // 음수면 반납 기한이 지났다
  hoursUntilDue: number;
}

// applicationId는 신청내역 목데이터(entities/events)의 신청완료 건으로 맞춘다. 홈 행 이름(Figma 홈 문구)과
// 신청내역의 행사명은 목데이터라 서로 다르다.
export interface HomeAppliedEvent {
  id: string;
  // 행을 누르면 여는 신청내역 상세
  applicationId: string;
  name: string;
  daysUntilEvent: number;
}

export type HomeFeeStatus = "unpaid" | "checking" | "needs-check" | "paid";

export type HomeLockerStatus = "none" | "assigned" | "expired";

export interface HomeMyInfo {
  feeStatus: HomeFeeStatus;
  feedbackCount: number;
  lockerStatus: HomeLockerStatus;
  lockerLabel?: string;
}

export interface HomeData {
  notices: HomeNotice[];
  applyCards: HomeApplyCard[];
  rentals: HomeRental[];
  appliedEvents: HomeAppliedEvent[];
  myInfo: HomeMyInfo;
}

// noticeId는 공지 목데이터(entities/notices, 1~5번)에 있는 공지로 맞춘다. 배너 문구와 공지 내용은
// 목데이터라 서로 다르다. 배너가 6개라 마지막 배너는 1번 공지를 연다.
const NOTICES: HomeNotice[] = [
  {
    id: "notice-1",
    noticeId: "1",
    subtitle: "여긴 부제목이 들어가요",
    template: "general",
    title: "일반공지 제목이 들어가는 자리입니다",
  },
  {
    id: "notice-2",
    noticeId: "2",
    subtitle: "여긴 부제목이 들어가요",
    template: "event",
    title: "2026-02 슬랑제 신청 안내",
  },
  {
    id: "notice-3",
    noticeId: "3",
    subtitle: "여긴 부제목이 들어가요",
    template: "partnership",
    title: "ECHO X 해커스토익 제휴 안내",
  },
  {
    id: "notice-4",
    noticeId: "4",
    subtitle: "여긴 부제목이 들어가요",
    template: "locker",
    title: "2026년도 사물함 신청 안내",
  },
  {
    id: "notice-5",
    noticeId: "5",
    subtitle: "여긴 부제목이 들어가요",
    template: "snack",
    title: "2026-02 기말고사 간식행사",
  },
  {
    id: "notice-6",
    noticeId: "1",
    subtitle: "여러분의 의견을 들려 주세요",
    template: "feedback",
    title: "stream에 바라는 점이 있다면?",
  },
];

// 행사 목데이터(entities/events)의 모집중 행사
const SPORTS_DAY: HomeApplyCard = {
  daysUntilDeadline: 2,
  eventId: "sw-sports-day-open",
  id: "sports-day",
  kind: "event",
  title: "소프트웨어융합대학 체육대회",
};

const LOCKER_2026: HomeApplyCard = {
  daysUntilDeadline: 2,
  id: "locker-2026",
  kind: "locker",
  title: "2026 사물함 신청",
};

// 상태를 바꿔 홈 3종 화면을 확인한다.
// few: 대여·신청 행사 2건 이하 (Figma 3147:146240), many: 3건 이상 (3147:146297), empty: 없음 (3147:146366)
type HomeMockState = "few" | "many" | "empty";
const MOCK_HOME_STATE: HomeMockState = "few";

const HOME_DATA: Record<HomeMockState, HomeData> = {
  empty: {
    appliedEvents: [],
    applyCards: [],
    myInfo: {
      feedbackCount: 1,
      feeStatus: "unpaid",
      lockerLabel: "B-21",
      lockerStatus: "assigned",
    },
    notices: NOTICES,
    rentals: [],
  },
  few: {
    appliedEvents: [
      {
        applicationId: "application-1",
        daysUntilEvent: 7,
        id: "opening-party",
        name: "26-2 개강 파티 신청 안내",
      },
    ],
    applyCards: [SPORTS_DAY, LOCKER_2026],
    myInfo: {
      feedbackCount: 0,
      feeStatus: "unpaid",
      lockerLabel: "B-21",
      lockerStatus: "assigned",
    },
    notices: NOTICES,
    rentals: [
      { hoursUntilDue: 23, icon: umbrella, id: "umbrella", name: "우산" },
      { hoursUntilDue: 2, icon: hairDryer, id: "hair-dryer", name: "드라이기" },
    ],
  },
  many: {
    appliedEvents: [
      {
        applicationId: "application-1",
        daysUntilEvent: 7,
        id: "opening-assembly",
        name: "26-2학기 개강총회",
      },
      {
        applicationId: "application-2",
        daysUntilEvent: 12,
        id: "sports-day",
        name: "소프트웨어융합대학 체육대회",
      },
      {
        applicationId: "application-1",
        daysUntilEvent: 20,
        id: "snack-event",
        name: "기말고사 간식행사",
      },
    ],
    applyCards: [SPORTS_DAY],
    myInfo: {
      feedbackCount: 1,
      feeStatus: "checking",
      lockerLabel: "B-21",
      lockerStatus: "assigned",
    },
    notices: NOTICES,
    rentals: [
      { hoursUntilDue: -2, icon: umbrella, id: "umbrella", name: "우산" },
      { hoursUntilDue: 2, icon: hairDryer, id: "hair-dryer", name: "드라이기" },
      {
        hoursUntilDue: 5,
        icon: powerBank,
        id: "power-bank",
        name: "보조배터리",
      },
    ],
  },
};

export const HOME_MOCK_DATA = HOME_DATA[MOCK_HOME_STATE];
