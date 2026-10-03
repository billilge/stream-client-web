export interface ArchiveItem {
  id: string;
  title: string;
  /** 이미 포맷된 표시용 문자열 (예: "2025.05.04") */
  date: string;
}

// Figma: 검색 완료 - 모든 검색 UI > Search Archiving Card (nodeId 3013:127633) 목업 데이터.
// 아카이빙 목록·상세 화면이 아직 없어서 지금은 검색 결과에서만 쓴다. 실 API가 붙으면 교체한다.
export const ARCHIVES: ArchiveItem[] = [
  { date: "2025.05.04", id: "1", title: "2025-2 기말고사 간식행사" },
  { date: "2025.04.02", id: "2", title: "2025-1 중간고사 간식행사" },
  { date: "2024.12.18", id: "3", title: "2024-2 학생회 송년회" },
  { date: "2024.10.11", id: "4", title: "2024 소프트웨어융합대학 체육대회" },
  { date: "2024.03.08", id: "5", title: "2024-1 새내기 배움터" },
];
