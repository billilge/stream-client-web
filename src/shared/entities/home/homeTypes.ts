import type { z } from "zod";

import type { homeResponseSchema } from "@/shared/entities/home/homeQueries";

// 홈 화면 전체(서버 HomeResponse) — 필드 설명은 homeQueries의 스키마에 있다
export type HomeResponse = z.infer<typeof homeResponseSchema>;
export type HomeBanner = HomeResponse["banners"][number];
export type HomeApplySection = HomeResponse["applySections"][number];
export type HomeAppliedEvent = HomeResponse["appliedEvents"]["content"][number];
export type HomeLockerStatus = HomeResponse["locker"]["status"];
