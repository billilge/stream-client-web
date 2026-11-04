import type { z } from "zod";

import type {
  NOTICE_CATEGORIES,
  noticeAttachmentSchema,
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

// 상세의 첨부파일 한 건
export type NoticeAttachment = z.infer<typeof noticeAttachmentSchema>;
