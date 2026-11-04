// 서버에 이메일 인증 API가 배포되기 전까지 이메일 인증을 흉내 내는 목 전용 코드다(stream-server #210). 실 API로 바꿀 때 이 파일째 지운다.

const MOCK_DELAY_MS = 700;

// 이메일 인증번호 확인의 목 응답 — 서버에 인증번호 발송·확인 API가 없어서 이 번호만 통과시킨다(어떤 이메일이든 같다).
export const MOCK_EMAIL_CODE = "123456";

// 개발 서버에서는 화면의 로딩 상태를 확인할 수 있게 일부러 늦게 응답하고, 배포 빌드에서는 바로 응답한다(lib/mockupApi의 mockupResponse와 같다).
export function mockDelay(): Promise<void> {
  if (!import.meta.env.DEV) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS);
  });
}
