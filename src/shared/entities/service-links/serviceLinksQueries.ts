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

// 운영진이 입력한 값을 그대로 열기 때문에 `https://` 주소만 연다(`javascript:` 같은 주소를 막는다).
// 그 밖의 주소는 링크가 없을 때(null)와 같게 다룬다 — 화면은 링크가 없으면 누를 수 없게 그린다.
// 이 검사를 openExternalLink에 넣지 않는 건 토스 송금 딥링크(`supertoss://`)도 그 함수로 열기 때문이다.
export function toOpenableUrl(url: string | null): string | null {
  return url?.startsWith("https://") ? url : null;
}
