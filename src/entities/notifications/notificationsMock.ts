import type { NotificationItem } from "@/entities/notifications/types";

// Figma: 알림 (nodeId 3595:107100) 목업 데이터 — 첫 항목만 안 읽은 알림이다.
export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    isRead: false,
    message: "우산 반납이 완료됐어요.",
    timeLabel: "1시간 전",
    type: "bililgeReturn",
  },
  {
    id: "2",
    isRead: true,
    message:
      "관리자가 대여 신청을 승인했어요. 학생회실에 방문해 우산을 대여해 주세요.",
    timeLabel: "1시간 전",
    type: "bililgeRental",
  },
  {
    id: "3",
    isRead: true,
    message: "새로운 공지사항이 올라왔어요. 자세한 내용을 확인해 주세요.",
    timeLabel: "1시간 전",
    type: "notices",
  },
  {
    id: "4",
    isRead: true,
    message:
      "열린피드백에 새로운 답변이 올라왔어요. 어떤 답변인지 확인해 보세요.",
    timeLabel: "1시간 전",
    type: "feedbacks",
  },
  {
    id: "5",
    isRead: true,
    message:
      "‘2026-02 기말고사 간식행사’가 내일 열려요. 행사 일정과 장소를 확인해 주세요.",
    timeLabel: "1시간 전",
    type: "events",
  },
  {
    id: "6",
    isRead: true,
    message: "사물함을 신청했어요. 배정된 사물함 번호를 확인해 주세요.",
    timeLabel: "1시간 전",
    type: "lockers",
  },
];
