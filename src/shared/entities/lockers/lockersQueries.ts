import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { homeKeys } from "@/shared/entities/home/homeKeys";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";
import type {
  LockerAssignment,
  LockerSectionDetailResponse,
  LockersLayoutBlock,
  LockersSectionDetail,
  MyLockerApplicationListResponse,
} from "@/shared/entities/lockers/lockersTypes";

const LOCKERS_PATH = "/v1/app/lockers";

export const LOCKER_APPLY_STATUSES = ["BEFORE_OPEN", "OPEN", "CLOSED"] as const;

export const lockerPeriodResponseSchema = z
  .looseObject({
    lockerPeriodId: z.number(),
    applyStartAt: z.string(),
    applyEndAt: z.string(),
    usageStartDate: z.string(),
    usageEndDate: z.string(),
    status: z.enum(LOCKER_APPLY_STATUSES),
  })
  .nullable();

export const LOCKER_AVAILABILITY_STATUSES = [
  "PLENTY",
  "NORMAL",
  "ALMOST_FULL",
  "FULL",
] as const;

export const lockerSectionListResponseSchema = z.looseObject({
  sections: z.array(
    z.looseObject({
      sectionId: z.number(),
      section: z.string(),
      availableCount: z.number(),
      totalCount: z.number(),
      availabilityStatus: z.enum(LOCKER_AVAILABILITY_STATUSES),
      hasMine: z.boolean(),
    }),
  ),
});

// root 형식은 서버가 아니라 칸 배치 화면이 정해서 여기서는 객체인지만 본다
export const lockerSectionDetailResponseSchema = z.looseObject({
  sectionId: z.number(),
  section: z.string(),
  layout: z
    .looseObject({
      version: z.number(),
      root: z.record(z.string(), z.unknown()),
    })
    .nullable(),
  photoUrls: z.array(z.string()),
  lockers: z.array(
    z.looseObject({
      lockerId: z.number(),
      lockerNumber: z.number(),
      lockerLabel: z.string(),
      isAvailable: z.boolean(),
      isMine: z.boolean(),
    }),
  ),
});

const layoutSizeSchema = z.union([
  z.literal("hug"),
  z.literal("fill"),
  z.number(),
]);
const layoutBlockBase = {
  height: layoutSizeSchema.optional(),
  width: layoutSizeSchema.optional(),
};

const lockersLayoutBlockSchema: z.ZodType<LockersLayoutBlock> = z.lazy(() =>
  z.union([
    z.object({
      ...layoutBlockBase,
      align: z.enum(["start", "center", "end", "stretch"]).optional(),
      children: z.array(lockersLayoutBlockSchema),
      gap: z.number().optional(),
      type: z.enum(["row", "column"]),
    }),
    z.object({
      ...layoutBlockBase,
      bordered: z.boolean().optional(),
      rows: z.array(z.array(z.number().nullable())),
      type: z.literal("lockerGroup"),
    }),
    z.object({
      ...layoutBlockBase,
      orientation: z.enum(["horizontal", "vertical"]).optional(),
      text: z.string(),
      type: z.literal("label"),
    }),
    z.object({
      ...layoutBlockBase,
      icon: z.literal("stairs").optional(),
      text: z.string(),
      type: z.literal("area"),
    }),
    z.object({ ...layoutBlockBase, text: z.string(), type: z.literal("text") }),
    z.object({ ...layoutBlockBase, type: z.literal("shelfLabel") }),
  ]),
);

const LOCKERS_LAYOUT_VERSION = 1;

// 칸 선택·위치 보기가 같이 쓰는 select. 모르는 형식 버전이거나 블록이 형식과 다르면 그리다 멈추지 않게
// layout을 null로 돌려 빈 화면을 보인다.
export function toLockersSectionDetail(
  response: LockerSectionDetailResponse,
): LockersSectionDetail {
  const root =
    response.layout?.version === LOCKERS_LAYOUT_VERSION
      ? lockersLayoutBlockSchema.safeParse(response.layout.root)
      : undefined;
  if (root && !root.success) {
    console.error("사물함 칸 배치 형식이 달라요.", root.error);
  }
  return {
    layout: root?.success
      ? { root: root.data, version: LOCKERS_LAYOUT_VERSION }
      : null,
    lockers: response.lockers,
    photoUrls: response.photoUrls,
    section: response.section,
    sectionId: response.sectionId,
  };
}

export const LOCKER_APPLICATION_STATUSES = ["ASSIGNED", "EXPIRED"] as const;

export const myLockerApplicationListResponseSchema = z
  .looseObject({
    applications: z.array(
      z.looseObject({
        lockerApplicationId: z.number(),
        lockerPeriodId: z.number(),
        lockerPeriodName: z.string(),
        applicationStatus: z.enum(LOCKER_APPLICATION_STATUSES),
        appliedAt: z.string(),
        usageStartDate: z.string(),
        usageEndDate: z.string(),
        lockerLabel: z.string(),
        sectionId: z.number(),
      }),
    ),
  })
  .nullable();

export const lockerApplyResponseSchema = z.looseObject({
  lockerApplicationId: z.number(),
  lockerId: z.number(),
  lockerLabel: z.string(),
  usageStartDate: z.string(),
  usageEndDate: z.string(),
});

export const lockersQueries = {
  period: () =>
    queryOptions({
      queryKey: lockersKeys.period(),
      queryFn: async ({ signal }) =>
        lockerPeriodResponseSchema.parse(
          await api.get<unknown>(`${LOCKERS_PATH}/period`, { signal }),
        ),
    }),
  sectionList: (lockerPeriodId: number) =>
    queryOptions({
      queryKey: lockersKeys.sectionList(lockerPeriodId),
      queryFn: async ({ signal }) =>
        lockerSectionListResponseSchema.parse(
          await api.get<unknown>(`${LOCKERS_PATH}/sections`, {
            params: { lockerPeriodId },
            signal,
          }),
        ),
    }),
  sectionDetail: (lockerPeriodId: number, sectionId: number) =>
    queryOptions({
      queryKey: lockersKeys.sectionDetail(lockerPeriodId, sectionId),
      queryFn: async ({ signal }) =>
        lockerSectionDetailResponseSchema.parse(
          await api.get<unknown>(`${LOCKERS_PATH}/sections/${sectionId}`, {
            params: { lockerPeriodId },
            signal,
          }),
        ),
    }),
  myApplications: () =>
    queryOptions({
      queryKey: lockersKeys.myApplications(),
      queryFn: async ({ signal }) =>
        myLockerApplicationListResponseSchema.parse(
          await api.get<unknown>(`${LOCKERS_PATH}/applications`, { signal }),
        ),
    }),
};

// 배정 상태·위치 보기가 같이 쓰는 select. 신청 일시 최신순이라 첫 건이 지금 배정이다.
export function toLockerAssignment(
  response: MyLockerApplicationListResponse,
): LockerAssignment | null {
  const application = response?.applications[0];
  if (!application) {
    return null;
  }
  return {
    appliedAt: application.appliedAt,
    lockerLabel: application.lockerLabel,
    lockerPeriodId: application.lockerPeriodId,
    sectionId: application.sectionId,
    semester: application.lockerPeriodName,
    status:
      application.applicationStatus === "EXPIRED" ? "expired" : "assigned",
    usageEndDate: application.usageEndDate,
    usageStartDate: application.usageStartDate,
  };
}

// 신청에서 화면이 갈라 처리하는 서버 에러 코드(LockerErrorCode)
export const LOCKERS_ERROR_CODES = {
  // 다른 사람이 같은 사물함을 먼저 신청했다
  lockerTaken: "LOCKER_ALREADY_ASSIGNED",
  // 이번 회차에 이미 사물함을 배정받았다
  alreadyAssigned: "MEMBER_ALREADY_HAS_LOCKER",
  applyNotOpen: "LOCKER_APPLY_NOT_OPEN",
  periodNotFound: "LOCKER_PERIOD_NOT_FOUND",
} as const;

export interface ApplyLockerVariables {
  lockerPeriodId: number;
  lockerId: number;
}

// POST /lockers/applications. 응답 형식이 달라도 서버에는 이미 배정이 생겼으니 실패로 바꾸지 않고 null을 돌려준다.
// 실패(남이 먼저 신청·이미 배정됨)도 남은 수·내 배정이 낡았다는 뜻이라 결과와 상관없이 캐시를 갱신한다.
// 홈의 사물함 신청 안내 카드(신청 여부)와 내 정보(배정 상태)도 바뀌어서 홈도 무효화한다.
// 결과 화면이 이 갱신을 기다리지 않게 Promise를 돌려주지 않는다.
export function useApplyLockerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: ApplyLockerVariables) => {
      const response = lockerApplyResponseSchema.safeParse(
        await api.post<unknown>(`${LOCKERS_PATH}/applications`, variables),
      );
      if (!response.success) {
        console.error("사물함 신청 응답 형식이 달라요.", response.error);
        return null;
      }
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: lockersKeys.sections() });
      queryClient.invalidateQueries({ queryKey: homeKeys.root() });
      queryClient.refetchQueries({
        exact: true,
        queryKey: lockersKeys.myApplications(),
      });
    },
  });
}
