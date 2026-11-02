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
