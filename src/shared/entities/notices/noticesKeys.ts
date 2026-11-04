import type { NoticeCategoryCode } from "@/shared/entities/notices/noticesTypes";

// 조회 캐시 key. 목록은 카테고리마다 따로 받아서(서버 커서가 카테고리별로 발급된다) 카테고리를 key에 넣는다.
// 카테고리가 null이면 거르지 않는 전체 목록이다.
export const noticesKeys = {
  root: () => ["notices"] as const,
  lists: () => [...noticesKeys.root(), "list"] as const,
  list: (category: NoticeCategoryCode | null) =>
    [...noticesKeys.lists(), category] as const,
  detail: (noticeId: number) =>
    [...noticesKeys.root(), "detail", noticeId] as const,
};
