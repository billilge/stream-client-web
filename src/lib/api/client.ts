import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { ApiError, NetworkError, TimeoutError } from "@/lib/api/errors";
import { clearAccessToken, getAccessToken } from "@/lib/api/token";
import type { ApiResponse } from "@/lib/api/types";

// 개발 서버는 비워 둔다 — `/v1/...`가 같은 주소로 나가고 Vite 프록시가 서버로 넘긴다(vite.config.ts).
// 배포 빌드는 서버 주소를 넣는다(.env.example).
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  // 응답이 없을 때 화면이 스켈레톤에 오래 묶이지 않게 끊는다
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    throw error;
  }
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    throw new TimeoutError("응답이 늦어 요청을 끊었어요.", { cause: error });
  }
  if (!error.response) {
    throw new NetworkError("서버에 연결하지 못했어요.", { cause: error });
  }
  // 토큰이 없거나 만료됐다 — 지우면 로그인 가드가 알림을 받고 로그인 화면으로 보낸다(token.ts).
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
