// stream-server 공통 응답 봉투(ApiResponse). 성공·실패가 같은 모양이고, 실패면 data가 null이다.
// 실패의 code는 서버 에러 enum 이름(UNAUTHORIZED, INVALID_INPUT …), message는 사용자에게 그대로 보여도 되는 문구다.
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
}

// 페이지 번호로 넘기는 목록 응답(서버 PageResponse)
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
}

// 커서로 이어 받는 목록 응답(서버 CursorSliceResponse). 마지막 페이지면 nextCursor가 null이다.
export interface CursorSliceResponse<T> {
  content: T[];
  hasNext: boolean;
  nextCursor: string | null;
}

// 앞의 몇 건과 전체 수(서버 PreviewResponse). 홈처럼 "미리보기 N건 + 더보기"를 그리는 화면이 쓰고, 이어 받지 않는다.
export interface PreviewResponse<T> {
  content: T[];
  totalCount: number;
}
