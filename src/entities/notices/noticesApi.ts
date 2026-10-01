import { NOTICES } from "@/entities/notices/noticesMock";
import type { Notice } from "@/entities/notices/types";
import { mockResponse } from "@/lib/mockResponse";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 noticesQueries로만 데이터를 받는다.
export function fetchNotices(): Promise<Notice[]> {
  return mockResponse(NOTICES);
}

// 없는 공지는 null — 상세 화면이 "존재하지 않는 공지예요"를 그린다.
export function fetchNotice(noticeId: string): Promise<Notice | null> {
  return mockResponse(NOTICES.find((notice) => notice.id === noticeId) ?? null);
}
