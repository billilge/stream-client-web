import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { mockupResponse } from "@/lib/mockupApi";
import { api, isApiError } from "@/shared/api";
import { archivesKeys } from "@/shared/entities/archives/archivesKeys";
import {
  ARCHIVES,
  findArchiveDetail,
} from "@/shared/entities/archives/archivesMock";

const ARCHIVES_PATH = "/v1/app/archives";

const ARCHIVE_NOT_FOUND = "ARCHIVE_NOT_FOUND";

export const archiveListResponseSchema = z.looseObject({
  archives: z.array(
    z.looseObject({
      archiveId: z.number(),
      title: z.string(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      thumbnailUrl: z.string().nullable(),
    }),
  ),
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
  // 연도 필터는 화면 select가 거른다 — year 없이 받아 연도를 바꿔도 다시 요청하지 않는다
  list: () =>
    queryOptions({
      queryKey: archivesKeys.list(),
      queryFn: async ({ signal }) =>
        archiveListResponseSchema.parse(
          await api.get<unknown>(ARCHIVES_PATH, { signal }),
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
          if (isApiError(error) && error.code === ARCHIVE_NOT_FOUND) {
            return null;
          }
          throw error;
        }
      },
    }),
  // TODO: 목록·상세·현장 사진 화면을 위 조회로 옮기면 지운다
  mockList: () =>
    queryOptions({
      queryKey: [...archivesKeys.root(), "mock-list"],
      queryFn: () => mockupResponse(() => ARCHIVES),
    }),
  mockDetail: (archiveId: string) =>
    queryOptions({
      queryKey: [...archivesKeys.root(), "mock-detail", archiveId],
      queryFn: () => mockupResponse(() => findArchiveDetail(archiveId)),
    }),
};
