import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, isApiError } from "@/shared/api";
import { archivesKeys } from "@/shared/entities/archives/archivesKeys";

const ARCHIVES_PATH = "/v1/app/archives";

export const archiveListItemSchema = z.looseObject({
  archiveId: z.number(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
});

export const archiveListResponseSchema = z.looseObject({
  archives: z.array(archiveListItemSchema),
  years: z.array(z.number()),
});

export const archiveDetailResponseSchema = z.looseObject({
  archiveId: z.number(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  location: z.string().nullable(),
  departmentName: z.string(),
  content: z.string(),
  images: z.array(
    z.looseObject({
      fileId: z.number(),
      fileUrl: z.string(),
    }),
  ),
  relatedEvent: z
    .looseObject({
      eventId: z.number(),
      title: z.string(),
    })
    .nullable(),
});

export const archivesQueries = {
  // 연도 필터는 화면 select가 거른다 — year 없이 받아 연도를 바꿔도 다시 요청하지 않는다.
  // keyword는 검색 화면의 아카이빙 탭이 제목으로 찾을 때만 넘긴다(연도 목록은 검색과 상관없이 전체다).
  list: (keyword: string | null = null) =>
    queryOptions({
      queryKey: archivesKeys.list(keyword),
      queryFn: async ({ signal }) =>
        archiveListResponseSchema.parse(
          await api.get<unknown>(ARCHIVES_PATH, {
            params: { keyword },
            signal,
          }),
        ),
    }),
  // 없는 아카이빙은 null — 상세·현장 사진 화면이 "존재하지 않는 아카이빙이에요" 빈 상태를 그린다
  detail: (archiveId: number) =>
    queryOptions({
      queryKey: archivesKeys.detail(archiveId),
      queryFn: async ({ signal }) => {
        try {
          return archiveDetailResponseSchema.parse(
            await api.get<unknown>(`${ARCHIVES_PATH}/${archiveId}`, { signal }),
          );
        } catch (error) {
          // 서버의 ARCHIVE_NOT_FOUND와 봉투 없이 온 404(게이트웨이 등)를 같이 본다
          if (isApiError(error) && error.status === 404) {
            return null;
          }
          throw error;
        }
      },
    }),
};
