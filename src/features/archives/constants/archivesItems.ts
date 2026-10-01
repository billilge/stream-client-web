import alumniPanelTalk from "@/assets/images/archives/alumni-panel-talk.jpg";
import freshmanOrientation from "@/assets/images/archives/freshman-orientation.jpg";
import snackEvent from "@/assets/images/archives/snack-event.jpg";
import sportsDay from "@/assets/images/archives/sports-day.jpg";

export interface ArchivesItem {
  id: string;
  title: string;
  date: string;
  image: string;
}

// Figma: 아카이빙 상세 Photo Grid (nodeId 1276:95409)의 앨범을 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
// 화면에서 짝수 인덱스는 왼쪽 열, 홀수 인덱스는 오른쪽 열에 배치되므로 Figma 열 순서대로 번갈아 적었다.
export const ARCHIVES_ITEMS: ArchivesItem[] = [
  {
    date: "2025.05.04",
    id: "2025-sports-day",
    image: sportsDay,
    title: "2025 체육대회",
  },
  {
    date: "2025.05.04",
    id: "2025-snack-event",
    image: snackEvent,
    title: "2025 간식행사",
  },
  {
    date: "2025.05.04",
    id: "2025-freshman-orientation",
    image: freshmanOrientation,
    title: "2025 새내기 배움터",
  },
  {
    date: "2025.05.04",
    id: "2025-alumni-panel-talk",
    image: alumniPanelTalk,
    title: "2025 동문패널톡",
  },
  {
    date: "2025.05.04",
    id: "2025-sports-day-2",
    image: sportsDay,
    title: "2025 체육대회",
  },
  {
    date: "2025.05.04",
    id: "2025-snack-event-2",
    image: snackEvent,
    title: "2025 간식행사",
  },
  {
    date: "2025.05.04",
    id: "2025-freshman-orientation-2",
    image: freshmanOrientation,
    title: "2025 새내기 배움터",
  },
  {
    date: "2025.05.04",
    id: "2025-alumni-panel-talk-2",
    image: alumniPanelTalk,
    title: "2025 동문패널톡",
  },
];
