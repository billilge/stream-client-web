import type { z } from "zod";

import type { serviceLinkResponseSchema } from "@/shared/entities/service-links/serviceLinksQueries";

// 학생 앱 외부 링크(서버 ServiceLinkResponse) — 필드 설명은 serviceLinksQueries의 스키마에 있다
export type ServiceLinkResponse = z.infer<typeof serviceLinkResponseSchema>;
