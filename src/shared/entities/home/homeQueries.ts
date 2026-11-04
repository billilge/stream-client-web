import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { FEE_STATUSES } from "@/shared/entities/fee/feeQueries";
import { homeKeys } from "@/shared/entities/home/homeKeys";

// 앞의 몇 건과 전체 수(서버 PreviewResponse) — 홈은 미리보기 2건과 "N건 더보기"만 그린다
function previewSchema<T extends z.ZodType>(item: T) {
  return z.looseObject({ content: z.array(item), totalCount: z.number() });
}

const homeBannerBaseSchema = {
  bannerId: z.number(),
  // 운영진이 넣은 줄바꿈(\n)이 들어갈 수 있다
  title: z.string(),
  subtitle: z.string().nullable(),
  // 카드 전체 배경 — 운영진이 고른 카테고리의 정해진 이미지나 직접 올린 이미지다. 파일이 지워졌으면 null
  imageUrl: z.string().nullable(),
};

// 상단 배너 한 건. 연결한 공지·행사가 지워졌거나 미게시이거나 이동할 곳이 비어 있는 배너는 서버가 빼서,
// 공지·행사(NOTICE·EVENT)는 targetId가, 외부 링크(EXTERNAL_LINK)는 linkUrl이 항상 있다
const homeBannerSchema = z.discriminatedUnion("landingType", [
  z.looseObject({
    ...homeBannerBaseSchema,
    landingType: z.enum(["NOTICE", "EVENT"]),
    targetId: z.number(),
  }),
  z.looseObject({
    ...homeBannerBaseSchema,
    landingType: z.literal("EXTERNAL_LINK"),
    linkUrl: z.string(),
  }),
]);

// 홈 화면 전체(서버 HomeResponse). 섹션이 비어도 필드는 빠지지 않는다. 일시는 시간대 없는 서버 시각
// ("2026-06-04T18:30:00"), 날짜는 "2026-06-04"다.
// 대여(rentals)도 오지만 홈 대여 현황은 반납 대기·확인을 나눠 보여 주려고 빌릴게 반납 조회를 써서 검사하지 않는다.
export const homeResponseSchema = z.looseObject({
  banners: z.array(homeBannerSchema),
  // 운영진이 노출한 신청 안내 중 지금 신청할 수 있는 것만 온다(마감·미게시는 서버가 뺀다)
  applySections: z.array(
    z.looseObject({
      // 행사는 행사 하나, 사물함은 운영 회차 하나다
      targetType: z.enum(["EVENT", "LOCKER"]),
      // 행사 ID 또는 사물함 운영 회차 ID
      targetId: z.number(),
      title: z.string(),
      applyEndAt: z.string(),
      // 이 학생이 이미 신청했는지
      isApplied: z.boolean(),
    }),
  ),
  // 오늘이나 그 뒤에 열리는 신청한 행사
  appliedEvents: previewSchema(
    z.looseObject({
      eventId: z.number(),
      title: z.string(),
      eventDate: z.string(),
    }),
  ),
  // 학생회비 조회(GET /v1/app/fee/me)와 같은 상태 이름이다. 납부를 요청한 적이 없으면 UNPAID
  studentFee: z.looseObject({ status: z.enum(FEE_STATUSES) }),
  // 작성한 열린피드백 질문 수
  openFeedback: z.looseObject({ writtenCount: z.number() }),
  locker: z.looseObject({
    // 신청한 적이 없으면 NOT_APPLIED
    status: z.enum(["NOT_APPLIED", "ASSIGNED", "EXPIRED"]),
    // 배정된 사물함 이름. ASSIGNED일 때만 있다
    lockerNumber: z.string().nullable(),
  }),
});

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const homeQueries = {
  // 홈 화면 데이터를 한 번에 받는다(GET /v1/app/home). 섹션마다 select로 자기 부분만 꺼내 읽어서,
  // 여러 섹션이 같이 읽어도 요청은 한 번이다.
  home: () =>
    queryOptions({
      queryKey: homeKeys.root(),
      queryFn: async ({ signal }) =>
        homeResponseSchema.parse(
          await api.get<unknown>("/v1/app/home", { signal }),
        ),
    }),
};
