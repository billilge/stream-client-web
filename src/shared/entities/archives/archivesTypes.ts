import type { z } from "zod";

import type {
  archiveDetailResponseSchema,
  archiveListResponseSchema,
} from "@/shared/entities/archives/archivesQueries";

export interface ArchiveItem {
  id: string;
  title: string;
  /** 이미 포맷된 표시용 문자열 (예: "2025.05.04") */
  date: string;
  /** 목록 카드·상세 대표 사진 */
  image: string;
}

export type ArchiveListResponse = z.infer<typeof archiveListResponseSchema>;
export type ArchiveListItemResponse = ArchiveListResponse["archives"][number];
export type ArchiveDetailResponse = z.infer<typeof archiveDetailResponseSchema>;
