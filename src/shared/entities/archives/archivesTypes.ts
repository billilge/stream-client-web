export interface ArchiveItem {
  id: string;
  title: string;
  /** 이미 포맷된 표시용 문자열 (예: "2025.05.04") */
  date: string;
  /** 목록 카드·상세 대표 사진 */
  image: string;
}

export interface ArchiveDetail extends ArchiveItem {
  /** 상세의 "일시" — 요일까지 붙은 표시용 문자열 (예: "2025.05.04 (금)") */
  schedule: string;
  location: string;
  department: string;
  activity: string;
  photos: string[];
  /** 관련 페이지 — 연결할 URL이 아직 없어 표시용 문구만 */
  links: string[];
}
