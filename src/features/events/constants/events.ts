import type { EventItem } from "@/entities/events/types";

// 모집 상태 필터. value는 EventStatus + "all"이고, 라벨은 Figma Filter Chips(1243:70861) 그대로.
export const EVENT_STATUS_FILTERS = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "open" },
  { label: "모집예정", value: "upcoming" },
  { label: "모집종료", value: "closed" },
] as const;

// 행사 목록의 행사/신청내역 탭은 경로로 나눈다 — 새로고침·뒤로가기에도 탭이 유지되고,
// 신청 완료 화면처럼 다른 화면에서도 신청내역 탭으로 바로 보낼 수 있다.
export const EVENTS_TAB_PATHS = {
  application: "/events/applications",
  event: "/events",
} as const;

export type EventsTab = keyof typeof EVENTS_TAB_PATHS;

// 신청내역 상태 배지 — 목록 카드와 상세가 같이 쓴다
export const EVENTS_APPLICATION_STATUS_BADGES = {
  applied: { color: "green", label: "신청완료" },
  cancelled: { color: "red", label: "신청취소" },
} as const;

// 학생회비 납부자 전용 행사인데 미납(납부확인중 포함)이면 하단 버튼을 막고 라벨로 보여주는 문구.
// Figma에 이 상태가 없어서, 모집예정이 막힌 버튼에 "N월 N일 오픈"을 쓰는 것과 같은 방식으로 정했다.
export const EVENTS_FEE_PAID_ONLY_LABEL = "학생회비 납부자만 신청할 수 있어요";

// 행사 상세 "대상" 문구 — 서버는 신청 조건 값만 주고 문구는 프론트가 조합한다(stream-server#190).
// Figma(2849:61152)의 "소프트웨어융합대학 과학생회비 납부자 선착순 150명"이 두 줄로 나뉘어 보여서
// 줄 단위로 돌려준다. 납부자 전용이 아니면 "학생", 상시 모집이면 정원 줄이 빠진다.
export function getEventAudience(event: EventItem): string[] {
  const audience = `소프트웨어융합대학 ${event.feePaidOnly ? "과학생회비 납부자" : "학생"}`;

  return event.recruitType === "first-come"
    ? [audience, `선착순 ${event.capacity}명`]
    : [audience];
}
