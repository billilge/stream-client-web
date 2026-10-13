import alumniPanelTalk from "@/assets/images/archives/alumni-panel-talk.jpg";
import freshmanOrientation from "@/assets/images/archives/freshman-orientation.jpg";
import haeoreumje from "@/assets/images/archives/haeoreumje.jpg";
import snackEvent from "@/assets/images/archives/snack-event.jpg";
import sportsDay from "@/assets/images/archives/sports-day.jpg";
import type { ArchiveDetail, ArchiveItem } from "@/entities/archives/types";

// Figma: 아카이빙 목록(nodeId 1276:95397) · 상세(nodeId 1526:171215) 목업 데이터.
// 검색 결과(SearchArchivingCard)와 아카이빙 목록·상세가 같은 데이터를 본다 — 검색에서 누른 앨범이
// 그대로 상세로 이어지도록 id 체계를 하나로 둔다. 실 API가 붙으면 이 파일만 교체한다.
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

// 현장 사진은 샘플 4장을 번갈아 채운다 — 전부 같은 파일이면 넘길 때 사진이 바뀌는지 확인할 수 없다.
// Figma 상세의 "24장 더보기"(2장 노출 + 24장)에 맞춰 26장이다.
const SAMPLE_PHOTOS = [
  freshmanOrientation,
  sportsDay,
  snackEvent,
  alumniPanelTalk,
];

function createPhotos(): string[] {
  return Array.from(
    { length: 26 },
    (_, index) => SAMPLE_PHOTOS[index % SAMPLE_PHOTOS.length],
  );
}

// 제목·날짜·대표 사진은 앨범마다 다르고, 나머지 상세 내용(일시 표기·장소·담당 부서·활동 내용·
// 현장 사진·관련 페이지)은 Figma 상세 한 화면에서 옮긴 값을 공통으로 쓴다 — 앨범별 문구는 아직 없다.
const ARCHIVE_DETAILS: Record<string, ArchiveDetail> = Object.fromEntries(
  ARCHIVES.map((archive) => [
    archive.id,
    {
      ...archive,
      activity:
        "약 300명의 학생이 참여해서 문화 공연, 체험 부스 등 다양한 프로그램이 진행됐어요. 다 같이 즐기며 알찬 하루를 보냈습니다!",
      department: "문화기획국",
      links: [`${archive.title} 공지 보러 가기`],
      location: "국민대 농구코트",
      photos: createPhotos(),
      schedule: `${archive.date} (금)`,
    },
  ]),
);

export function findArchiveDetail(archiveId: string): ArchiveDetail | null {
  return ARCHIVE_DETAILS[archiveId] ?? null;
}
