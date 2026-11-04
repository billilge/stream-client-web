import { formatDate } from "@/lib/date";
import type {
  NoticeCategory,
  NoticeCategoryCode,
} from "@/shared/entities/notices/noticesTypes";

export const NOTICES_PATH = "/notices";

// 서버의 공지 종류 코드를 화면 라벨("일반 공지"의 앞부분)로 바꾼다
export const NOTICE_CATEGORY_LABELS: Record<
  NoticeCategoryCode,
  NoticeCategory
> = {
  GENERAL: "일반",
  PARTNERSHIP: "제휴",
};

export function getNoticePath(noticeId: number | string) {
  return `${NOTICES_PATH}/${noticeId}`;
}

// 서버 일시("2026-09-03T10:00:00")를 목록·상세가 쓰는 "2026.09.03"으로 바꾼다
export function formatNoticeDate(createdAt: string) {
  return formatDate(createdAt.slice(0, 10));
}
