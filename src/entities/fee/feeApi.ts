import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { FeeResponse, FeeSubmitRequest } from "@/entities/fee/types";
import { api } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";

const feeKeys = {
  root: () => ["fee"] as const,
  me: () => [...feeKeys.root(), "me"] as const,
  transferGuide: (remainingSemesters: number) =>
    [...feeKeys.root(), "transfer-guide", remainingSemesters] as const,
};

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const feeQueries = {
  // 내 납부 현황(GET /v1/app/fee/me) — 납부내역과 행사 상세의 학생회비 납부자 전용 판단이 같이 쓴다.
  me: () =>
    queryOptions({
      queryKey: feeKeys.me(),
      queryFn: ({ signal }) =>
        api.get<FeeResponse>("/v1/app/fee/me", { signal }),
    }),
  // 남은 학기 수로 계산한 금액과 토스 송금 링크 — 같은 API에 학기 수를 실어 보낸다(서버는 아무것도 저장하지 않는다).
  // 지금 낼 수 없는 상태(납부확인중·납부완료)면 링크가 null이다.
  transferGuide: (remainingSemesters: number) =>
    queryOptions({
      queryKey: feeKeys.transferGuide(remainingSemesters),
      queryFn: ({ signal }) =>
        api.get<FeeResponse>("/v1/app/fee/me", {
          params: { remainingSemesters },
          signal,
        }),
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
// 납부 상태와 학기 수별 송금 링크가 모두 바뀌어서 회비 캐시를 통째로 무효화한다 — 이미 요청이 들어가 있다는
// 응답(409)도 지금 캐시가 낡았다는 뜻이라 같이 무효화한다.
export function useSubmitFeeMutation() {
  const queryClient = useQueryClient();
  const invalidateFee = () =>
    queryClient.invalidateQueries({ queryKey: feeKeys.root() });

  return useMutation({
    mutationFn: (request: FeeSubmitRequest) =>
      api.post<FeeResponse>("/v1/app/fee", request),
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
