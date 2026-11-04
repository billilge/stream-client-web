import type { z } from "zod";

import type { searchResponseSchema } from "@/shared/entities/search/searchQueries";

// 통합 검색 응답(GET /v1/app/search) 그대로다 — searchQueries.ts의 응답 검사 스키마에서 만든다
export type SearchResponse = z.infer<typeof searchResponseSchema>;
