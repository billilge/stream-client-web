import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { ApiError, NetworkError, TimeoutError } from "@/lib/api/errors";
import { clearAccessToken, getAccessToken } from "@/lib/api/token";
import type { ApiResponse } from "@/lib/api/types";

// 서버 주소는 로컬·배포 모두 환경변수로 넣는다(.env.example). 비어 있으면 `/v1/...`가 웹 주소로 나가
// 웹의 index.html이 돌아오고, 아래 unwrap이 에러로 만든다.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  // 응답이 없을 때 화면이 스켈레톤에 오래 묶이지 않게 끊는다
  timeout: 10_000,
  // 시간 초과를 ETIMEDOUT으로 따로 받는다 — 기본값이면 브라우저가 끊은 요청과 같은 ECONNABORTED로 온다
  transitional: { clarifyTimeoutError: true },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  // TanStack Query가 화면을 떠나며 취소한 요청은 에러로 바꾸지 않고 그대로 넘긴다
  if (!axios.isAxiosError(error) || axios.isCancel(error)) {
    throw error;
  }
  if (error.code === "ETIMEDOUT") {
    throw new TimeoutError("응답이 늦어 요청을 끊었어요.", { cause: error });
  }
  if (!error.response) {
    throw new NetworkError("서버에 연결하지 못했어요.", { cause: error });
  }
  // 토큰이 없거나 만료됐다 — 지우고 알린다(token.ts). 로그인 화면으로 보내는 가드는 로그인 실연결 때 붙인다.
  // 서버에 재발급이 생기면 여기서 재발급하고 원래 요청을 다시 보낸다.
  if (error.response.status === 401) {
    clearAccessToken();
  }
  const body = isApiResponse(error.response.data)
    ? error.response.data
    : undefined;
  throw new ApiError(error.response.status, body, { cause: error });
});

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "code" in value
  );
}

// 응답 봉투를 벗겨 data만 돌려준다. 서버 봉투가 아니면(주소를 잘못 넣어 웹의 index.html을 받은 경우 등)
// 빈 값으로 조용히 넘어가지 않게 에러로 만든다.
async function unwrap<T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
  const response = await request;
  if (!isApiResponse(response.data)) {
    throw new ApiError(response.status, undefined);
  }
  return response.data.data as T;
}

// entities의 queryFn·mutationFn이 쓰는 요청 함수. 화면은 이걸 직접 부르지 않는다.
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.get(url, config)),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.post(url, body, config)),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.put(url, body, config)),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.patch(url, body, config)),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.delete(url, config)),
};
