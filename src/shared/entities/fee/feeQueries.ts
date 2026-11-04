import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api, isApiError } from "@/shared/api";
import { feeKeys } from "@/shared/entities/fee/feeKeys";
import type { FeeSubmitRequest } from "@/shared/entities/fee/feeTypes";
import { homeKeys } from "@/shared/entities/home/homeKeys";

const FEE_PATH = "/v1/app/fee";

export const FEE_STATUSES = ["UNPAID", "PENDING", "PAID", "REJECTED"] as const;

// 내 학생회비 납부 현황(서버 FeeResponse). 학생회비 조회·납부 요청이 같은 모양으로 준다.
// 금액·송금 링크는 지금 낼 수 있을 때(UNPAID·REJECTED에 남은 학기 수를 보냈을 때)만 계산해 주고,
// PENDING·PAID면 요청 때 남긴 금액만 준다(링크는 null). 일시는 시간대 없는 서버 시각("2026-09-04T11:49:00")이다.
export const feeResponseSchema = z.looseObject({
  // 한 번도 요청하지 않았으면 null
  studentTransferStatusId: z.number().nullable(),
  feeStatus: z.enum(FEE_STATUSES),
  // 계좌를 설정하기 전이면 서버가 이 응답 대신 404(FEE_ACCOUNT_NOT_FOUND)를 준다
  bank: z.string(),
  accountNo: z.string(),
  remainingSemesters: z.number().nullable(),
  transferAmount: z.number().nullable(),
  // 금액이 채워진 토스 송금 딥링크(supertoss://send?…)
  transferLinkUrl: z.string().nullable(),
  requestedAt: z.string().nullable(),
  // 납부완료(PAID)일 때만 있다
  confirmedAt: z.string().nullable(),
  // 확인필요(REJECTED)일 때만 있다 — 그때는 서버가 항상 채운다
  rejectReason: z.string().nullable(),
});

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const feeQueries = {
  // 내 납부 현황(GET /v1/app/fee/me) — 납부내역과 행사 상세의 학생회비 납부자 전용 판단이 같이 쓴다.
  me: () =>
    queryOptions({
      queryKey: feeKeys.me(),
      queryFn: async ({ signal }) =>
        feeResponseSchema.parse(
          await api.get<unknown>(`${FEE_PATH}/me`, { signal }),
        ),
    }),
  // 남은 학기 수로 계산한 금액과 토스 송금 링크 — 같은 API에 학기 수를 실어 보낸다(서버는 아무것도 저장하지 않는다).
  // 지금 낼 수 없는 상태(납부확인중·납부완료)면 링크가 null이다.
  transferGuide: (remainingSemesters: number) =>
    queryOptions({
      queryKey: feeKeys.transferGuide(remainingSemesters),
      queryFn: async ({ signal }) =>
        feeResponseSchema.parse(
          await api.get<unknown>(`${FEE_PATH}/me`, {
            params: { remainingSemesters },
            signal,
          }),
        ),
    }),
};

// 납부 요청에서 화면이 갈라 처리하는 서버 에러 코드(FeeErrorCode)
export const FEE_ERROR_CODES = {
  // 이미 납부 확인을 요청했거나 납부가 끝난 학생이 또 냈다
  alreadyRequested: "FEE_REQUEST_ALREADY_REQUESTED",
  // 캡처 키가 없거나, 본인이 학점이수현황 캡처로 올린 파일이 아니다
  invalidProofImage: "INVALID_PROOF_IMAGE",
} as const;

// 학생회비 납부 요청(POST /v1/app/fee). 성공하면 납부확인중이 된다.
// 납부 상태와 학기 수별 송금 링크가 모두 바뀌어서 회비 캐시를 통째로 무효화하고, 홈 내 정보의 납부 상태도 바뀌어서
// 홈도 무효화한다 — 이미 요청이 들어가 있다는 응답(409)도 지금 캐시가 낡았다는 뜻이라 같이 무효화한다.
export function useSubmitFeeMutation() {
  const queryClient = useQueryClient();
  const invalidateFee = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: feeKeys.root() }),
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
    ]);

  return useMutation({
    // 응답(납부 현황)은 쓰지 않는다 — 무효화로 다시 받는 me 조회가 스키마로 검사한다.
    // 여기서도 검사하면 서버에 이미 접수된 요청을 응답 모양 때문에 실패로 안내하게 된다.
    mutationFn: async (request: FeeSubmitRequest) => {
      await api.post<unknown>(FEE_PATH, request);
    },
    // Promise를 돌려줘서 다시 받은 상태가 들어온 뒤에 mutation이 끝나게 한다
    onSuccess: invalidateFee,
    onError: (error) => {
      if (
        isApiError(error) &&
        error.code === FEE_ERROR_CODES.alreadyRequested
      ) {
        return invalidateFee();
      }
    },
  });
}
