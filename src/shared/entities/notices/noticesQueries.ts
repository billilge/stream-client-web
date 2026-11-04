import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, isApiError } from "@/shared/api";
import { noticesKeys } from "@/shared/entities/notices/noticesKeys";
import type { NoticeCategoryCode } from "@/shared/entities/notices/noticesTypes";

const NOTICES_PATH = "/v1/app/notices";

// 서버 enum(NoticeCategory) 값 — 타입은 noticesTypes.ts가 여기서 만든다
export const NOTICE_CATEGORIES = ["GENERAL", "PARTNERSHIP"] as const;

// 화면이 갈라 처리하는 서버 에러 코드(NoticeErrorCode)
export const NOTICE_ERROR_CODES = {
  // 없거나 삭제된 공지
  notFound: "NOTICE_NOT_FOUND",
} as const;

// 서버 응답 검사 — 서버가 필드를 더 보내도 깨지지 않게 looseObject로 두고, 빠지거나 타입이 바뀌면 여기서 실패한다.
// 일시는 오프셋 없는 KST("2026-09-03T10:00:00")다.
export const noticeListItemSchema = z.looseObject({
  noticeId: z.number(),
  title: z.string(),
  category: z.enum(NOTICE_CATEGORIES),
  createdAt: z.string(),
  // 등록된 이미지 중 첫 번째 — 이미지가 없는 공지는 비어 온다(null 또는 생략)
  thumbnailUrl: z.string().nullish(),
  // 상단 고정 — 서버가 고정 공지를 먼저 준다
  pinned: z.boolean(),
});

// 커서로 이어 받는 목록(서버 CursorSliceResponse) — 마지막 페이지면 nextCursor가 비어 온다
export const noticePageSchema = z.looseObject({
  content: z.array(noticeListItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullish(),
});

// 상세의 첨부파일 — 주소는 이미지처럼 바로 받을 수 있는 공개 URL이고, fileName은 올린 파일의 원래 이름이다.
// 서버가 파일 크기는 주지 않는다.
export const noticeAttachmentSchema = z.looseObject({
  fileId: z.number(),
  fileName: z.string(),
  fileUrl: z.string(),
});

// 상세 — 본문(content)은 서식 없는 일반 텍스트이고 줄바꿈이 보존된다. 이미지 주소는 바로 쓸 수 있는 공개 URL이다.
export const noticeDetailSchema = z.looseObject({
  noticeId: z.number(),
  title: z.string(),
  content: z.string(),
  category: z.enum(NOTICE_CATEGORIES),
  pinned: z.boolean(),
  images: z.array(
    z.looseObject({
      fileId: z.number(),
      fileUrl: z.string(),
    }),
  ),
  attachments: z.array(noticeAttachmentSchema),
  createdAt: z.string(),
});

// 다음 페이지 커서 — 마지막 페이지면 null이라 더 받지 않는다
function getNextCursor(lastPage: z.infer<typeof noticePageSchema>) {
  return lastPage.hasNext ? (lastPage.nextCursor ?? null) : null;
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const noticesQueries = {
  // 공지를 고정 먼저, 최신순으로 이어 받는다(GET /v1/app/notices). category가 null이면 거르지 않는다.
  // 한 번에 서버 기본값(20개)씩 받는다. keyword는 검색 화면의 공지 탭이 제목으로 찾을 때만 넘긴다.
  list: (category: NoticeCategoryCode | null, keyword: string | null = null) =>
    infiniteQueryOptions({
      queryKey: noticesKeys.list(category, keyword),
      queryFn: async ({ pageParam, signal }) =>
        noticePageSchema.parse(
          await api.get<unknown>(NOTICES_PATH, {
            // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이, 전체는 category 없이 간다
            params: { category, cursor: pageParam, keyword },
            signal,
          }),
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 없는 공지는 null — 상세 화면이 "존재하지 않는 공지예요"를 그린다.
  detail: (noticeId: number) =>
    queryOptions({
      queryKey: noticesKeys.detail(noticeId),
      queryFn: async ({ signal }) => {
        try {
          return noticeDetailSchema.parse(
            await api.get<unknown>(`${NOTICES_PATH}/${noticeId}`, { signal }),
          );
        } catch (error) {
          if (isApiError(error) && error.code === NOTICE_ERROR_CODES.notFound) {
            return null;
          }
          throw error;
        }
      },
    }),
};
