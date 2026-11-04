import { formatHourMinute, formatMonthDay } from "@/lib/date";
import type {
  EventDetail,
  EventListItem,
  EventRecruitStatus,
} from "@/shared/entities/events/eventsTypes";

// 모집 상태 필터. value는 서버 모집 상태(목록 조회의 recruitStatus) + "all"이고, 라벨은 Figma Filter Chips(1243:70861) 그대로.
export const EVENT_STATUS_FILTERS = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "OPEN" },
  { label: "모집예정", value: "BEFORE_OPEN" },
  { label: "모집종료", value: "CLOSED" },
] as const;

export type EventStatusFilter = (typeof EVENT_STATUS_FILTERS)[number]["value"];

const EVENT_STATUS_LABELS: Record<EventRecruitStatus, string> = {
  BEFORE_OPEN: "모집예정",
  CLOSED: "모집종료",
  OPEN: "모집중",
};

// 상태 뱃지 문구 — 모집중은 마감까지 남은 일수로 "신청마감 D-2"(마감 당일은 "D-Day")가 된다
export function getEventStatusLabel(
  event: Pick<EventListItem, "recruitStatus" | "daysUntilDeadline">,
): string {
  if (event.recruitStatus !== "OPEN" || event.daysUntilDeadline === null) {
    return EVENT_STATUS_LABELS[event.recruitStatus];
  }
  const dDay =
    event.daysUntilDeadline === 0 ? "D-Day" : `D-${event.daysUntilDeadline}`;
  return `신청마감 ${dDay}`;
}

// 목록 카드 신청 버튼 문구 — 모집예정은 Figma(1243:70869)처럼 신청 시작일만 써서 "8월 10일 오픈"이 된다
export function getEventActionLabel(
  event: Pick<EventListItem, "recruitStatus" | "applyStartAt">,
): string {
  if (event.recruitStatus === "BEFORE_OPEN") {
    return `${formatMonthDay(event.applyStartAt)} 오픈`;
  }
  return event.recruitStatus === "OPEN" ? "신청하기" : "모집종료";
}

// 상세 하단 버튼 문구 — 모집예정은 Figma(1156:53992)처럼 신청 시작 시각까지 써서 "8월 10일 18시 오픈"이 된다.
// 나머지 상태는 목록 카드와 같다
export function getEventDetailActionLabel(
  event: Pick<EventDetail, "recruitStatus" | "applyStartAt">,
): string {
  if (event.recruitStatus === "BEFORE_OPEN") {
    return `${formatMonthDay(event.applyStartAt)} ${formatHourMinute(event.applyStartAt)} 오픈`;
  }
  return getEventActionLabel(event);
}

// "2026-04-15T18:30:00" → "18:30"
function getTime(value: string): string {
  return value.split("T")[1].slice(0, 5);
}

// 상세 "일시" — "4월 15일 (수) 18:30"처럼 시작 일시를 쓰고, 끝 일시가 있을 때만 "~ 20:00"(같은 날)이나
// "~ 4월 16일 (목) 12:00"(다른 날)을 붙인다. 끝 일시가 없는 행사는 Figma(1133:42433)의 "~"를 붙이지 않는다
export function getEventSchedule(
  event: Pick<EventDetail, "eventStartAt" | "eventEndAt">,
): string {
  const { eventStartAt, eventEndAt } = event;
  const start = `${formatMonthDay(eventStartAt, { weekday: true })} ${getTime(eventStartAt)}`;
  if (!eventEndAt) {
    return start;
  }
  const end =
    eventEndAt.slice(0, 10) === eventStartAt.slice(0, 10)
      ? getTime(eventEndAt)
      : `${formatMonthDay(eventEndAt, { weekday: true })} ${getTime(eventEndAt)}`;
  return `${start} ~ ${end}`;
}

// 행사 목록의 행사/신청내역 탭은 경로로 나눈다 — 새로고침·뒤로가기에도 탭이 유지되고,
// 신청 완료 화면처럼 다른 화면에서도 신청내역 탭으로 바로 보낼 수 있다.
export const EVENTS_TAB_PATHS = {
  application: "/events/applications",
  event: "/events",
} as const;

export type EventsTab = keyof typeof EVENTS_TAB_PATHS;

// 신청내역 상태 배지 — 목록 카드와 상세가 같이 쓴다
export const EVENTS_APPLICATION_STATUS_BADGES = {
  APPLIED: { color: "green", label: "신청완료" },
  CANCELED: { color: "red", label: "신청취소" },
} as const;

// 학생회비 납부자 전용 행사인데 신청 자격(isFeeEligible — 서버가 납부자 명부로 판단)이 없으면
// 하단 버튼을 막고 라벨로 보여주는 문구.
// Figma에 이 상태가 없어서, 모집예정이 막힌 버튼에 "N월 N일 N시 오픈"을 쓰는 것과 같은 방식으로 정했다.
export const EVENTS_FEE_PAID_ONLY_LABEL = "학생회비 납부자만 신청할 수 있어요";

// 행사 상세 "대상" 문구 — 서버는 신청 조건 값만 주고 문구는 프론트가 조합한다(stream-server#190).
// Figma(2849:61152)의 "소프트웨어융합대학 과학생회비 납부자 선착순 150명"이 두 줄로 나뉘어 보여서
// 줄 단위로 돌려준다. 납부자 전용이 아니면 "학생", 선착순이 아니면 정원 줄이 빠진다.
export function getEventAudience(
  event: Pick<EventDetail, "feePaidOnly" | "recruitType" | "capacity">,
): string[] {
  const audience = `소프트웨어융합대학 ${event.feePaidOnly ? "과학생회비 납부자" : "학생"}`;

  return event.recruitType === "FIRST_COME" &&
    typeof event.capacity === "number"
    ? [audience, `선착순 ${event.capacity}명`]
    : [audience];
}
