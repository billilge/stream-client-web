import type { z } from "zod";

import type {
  NOTICE_CATEGORIES,
  noticeDetailSchema,
  noticeListItemSchema,
  noticePageSchema,
} from "@/shared/entities/notices/noticesQueries";

// 서버 학생 앱 공지 API(/v1/app/notices/**) 응답 모양 그대로다 — noticesQueries.ts의 응답 검사 스키마에서 만든다.
// 화면 모양(카테고리 라벨·날짜 표기)은 화면 쪽에서 바꾼다.

// 공지 종류(서버 NoticeCategory). 화면 라벨은 features/notices/constants/notices.ts의 NOTICE_CATEGORY_LABELS
export type NoticeCategoryCode = (typeof NOTICE_CATEGORIES)[number];

// 목록의 공지 한 건
export type NoticeListItem = z.infer<typeof noticeListItemSchema>;

export type NoticePageResponse = z.infer<typeof noticePageSchema>;

// 상세
export type NoticeDetail = z.infer<typeof noticeDetailSchema>;

// 검색 결과의 공지 — 검색은 아직 목데이터라(서버 검색 API 연동 전) 예전 화면 모양을 그대로 쓴다.
// 검색을 서버에 붙이면 아래 타입과 noticesMock.ts는 사라진다.
export type NoticeCategory = "일반" | "제휴";

export interface NoticeAttachment {
  id: string;
  /** 확장자를 포함한 원래 파일 이름 — 내려받을 때 저장 이름으로도 쓴다. */
  name: string;
  /** 바이트 단위 */
  size: number;
  url: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  isPinned?: boolean;
  hasThumbnail?: boolean;
  /** 상세 화면 이미지 갤러리 총 장수 — hasThumbnail일 때만 의미가 있다. */
  photoCount?: number;
  body: string;
  attachments?: NoticeAttachment[];
}
