import type { z } from "zod";

import type {
  archiveDetailResponseSchema,
  archiveListResponseSchema,
} from "@/shared/entities/archives/archivesQueries";

export type ArchiveListResponse = z.infer<typeof archiveListResponseSchema>;
export type ArchiveListItemResponse = ArchiveListResponse["archives"][number];
export type ArchiveDetailResponse = z.infer<typeof archiveDetailResponseSchema>;
