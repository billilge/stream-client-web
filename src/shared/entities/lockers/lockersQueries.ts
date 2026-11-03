import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { mockupResponse } from "@/lib/mockupApi";
import { api } from "@/shared/api";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";
import { LOCKER_ASSIGNMENT_MOCK } from "@/shared/entities/lockers/lockersMock";

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
  // 배정 상태·위치 보기 화면이 myApplications로 옮겨 가면 지운다(구현 7단계)
  myAssignment: () =>
    queryOptions({
      queryKey: lockersKeys.myAssignment(),
      queryFn: () => mockupResponse(() => LOCKER_ASSIGNMENT_MOCK),
    }),
};
