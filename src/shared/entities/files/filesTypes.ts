import type { z } from "zod";

import type { fileUploadUrlResponseSchema } from "@/shared/entities/files/filesQueries";

// 업로드 URL을 받을 때 밝히는 파일 용도(서버 FileCategory) — 용도마다 서버가 받는 형식·용량이 다르다.
// 앱이 올리는 용도만 둔다.
export type FileCategory = "FEE_TRANSCRIPT_IMAGE";

// POST /v1/files/presigned-url 응답(서버 FileUploadUrlIssueResponse)
export type FileUploadUrlResponse = z.infer<typeof fileUploadUrlResponseSchema>;
