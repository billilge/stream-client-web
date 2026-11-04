import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { serviceLinksKeys } from "@/shared/entities/service-links/serviceLinksKeys";

const SERVICE_LINKS_PATH = "/v1/app/service-links";

// 설정 화면 서비스 정보의 외부 링크(서버 ServiceLinkResponse). 운영진이 등록하지 않은 링크는 null이다.
// 값은 그대로 열 수 있는 전체 URL이다.
export const serviceLinkResponseSchema = z.looseObject({
  // '의견 보내기'가 여는 구글폼 주소 — 앱 서비스에 대한 의견이라 열린피드백과는 다르다
  feedbackFormUrl: z.string().nullable(),
  // '개인정보 처리방침'이 여는 노션 페이지 주소
  privacyPolicyUrl: z.string().nullable(),
});

// 화면은 이 queryOptions로만 데이터를 받는다
export const serviceLinksQueries = {
  // 서비스 링크(GET /v1/app/service-links)
  all: () =>
    queryOptions({
      queryKey: serviceLinksKeys.root(),
      queryFn: async ({ signal }) =>
        serviceLinkResponseSchema.parse(
          await api.get<unknown>(SERVICE_LINKS_PATH, { signal }),
        ),
    }),
};
