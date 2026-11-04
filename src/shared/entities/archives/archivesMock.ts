import alumniPanelTalk from "@/assets/images/archives/alumni-panel-talk.jpg";
import freshmanOrientation from "@/assets/images/archives/freshman-orientation.jpg";
import haeoreumje from "@/assets/images/archives/haeoreumje.jpg";
import snackEvent from "@/assets/images/archives/snack-event.jpg";
import sportsDay from "@/assets/images/archives/sports-day.jpg";
import type { ArchiveItem } from "@/shared/entities/archives/archivesTypes";

// 검색 결과(SearchArchivingCard)만 쓰는 목데이터 — 아카이빙 화면은 서버 조회로 바뀌었고, 검색 API를 붙일 때 지운다.
export const ARCHIVES: ArchiveItem[] = [
  {
    date: "2025.05.04",
    id: "1",
    image: haeoreumje,
    title: "2025-2 기말고사 간식행사",
  },
  {
    date: "2025.04.02",
    id: "2",
    image: snackEvent,
    title: "2025-1 중간고사 간식행사",
  },
  {
    date: "2024.12.18",
    id: "3",
    image: alumniPanelTalk,
    title: "2024-2 학생회 송년회",
  },
  {
    date: "2024.10.11",
    id: "4",
    image: sportsDay,
    title: "2024 소프트웨어융합대학 체육대회",
  },
  {
    date: "2024.03.08",
    id: "5",
    image: freshmanOrientation,
    title: "2024-1 새내기 배움터",
  },
];
