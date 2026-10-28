import type { ApiResponse } from "@/lib/api/types";

// 서버까지 닿지 못한 요청(오프라인·DNS·CORS 차단 등)
export class NetworkError extends Error {
  name = "NetworkError";
}

// 정해 둔 시간 안에 응답이 오지 않은 요청
export class TimeoutError extends Error {
  name = "TimeoutError";
}

// 서버가 실패로 응답한 요청. 화면은 code로 분기하고 message를 사용자에게 보여 준다.
export class ApiError extends Error {
  name = "ApiError";
  readonly status: number;
  readonly code: string;

  constructor(
    status: number,
    body: ApiResponse<unknown> | undefined,
    options?: ErrorOptions,
  ) {
    // 서버 봉투가 아닌 응답(게이트웨이 502 페이지 등)은 상태 코드로 대신한다
    super(body?.message ?? `HTTP ${status}`, options);
    this.status = status;
    this.code = body?.code ?? `HTTP_${status}`;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// 토큰이 없거나 만료된 요청 — 다시 로그인해야 한다
export function isUnauthorizedError(error: unknown): error is ApiError {
  return isApiError(error) && error.status === 401;
}
