import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";
import type {
  LockerAssignment,
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
      queryClient.refetchQueries({
        exact: true,
        queryKey: lockersKeys.myApplications(),
      });
    },
  });
}
