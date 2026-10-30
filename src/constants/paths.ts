// 화면 이동에서 여러 곳이 같이 쓰는 라우트 경로. 경로를 바꿀 때 이 파일 한 곳만 보면 되도록 모아 둔다.
// 개별 화면 경로(`/events/:eventId` 등)는 router.tsx에서만 선언하고, 여기에는 홈·로그인처럼
// 가드·뒤로가기 폴백·완료 화면이 되돌아가는 곳으로 쓰이는 경로만 둔다.
export const HOME_PATH = "/home";
export const LOGIN_PATH = "/login";
