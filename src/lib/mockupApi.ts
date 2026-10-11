// 실 API가 붙기 전까지 entities의 API 함수가 목데이터를 서버 응답처럼 비동기로 돌려줄 때 쓴다.
// 개발 서버에서는 화면의 로딩 스켈레톤을 확인할 수 있게 일부러 늦게 응답하고, 배포 빌드에서는 바로 응답한다.
const MOCK_DELAY_MS = 500;

// 화면은 use()로 이 Promise를 읽는데, 렌더마다 새 Promise를 만들면 매번 다시 서스펜드된다.
// 그래서 요청(key)마다 Promise를 한 번만 만들어 재사용한다 — 다시 들어온 화면은 스켈레톤 없이 바로 그려진다.
// 실 API로 바꿀 때는 TanStack Query 같은 서버 상태 라이브러리가 이 캐시 역할을 맡는다.
const cache = new Map<string, Promise<unknown>>();

export function mockupApi<T>(key: string, getData: () => T): Promise<T> {
  const cached = cache.get(key);
  if (cached) {
    return cached as Promise<T>;
  }

  const promise = import.meta.env.DEV
    ? new Promise<T>((resolve) => {
        setTimeout(() => resolve(getData()), MOCK_DELAY_MS);
      })
    : Promise.resolve(getData());
  cache.set(key, promise);
  return promise;
}
