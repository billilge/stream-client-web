import alumniPanelTalk from "@/assets/images/archives/alumni-panel-talk.jpg";
import freshmanOrientation from "@/assets/images/archives/freshman-orientation.jpg";
import haeoreumje from "@/assets/images/archives/haeoreumje.jpg";
import snackEvent from "@/assets/images/archives/snack-event.jpg";
import sportsDay from "@/assets/images/archives/sports-day.jpg";

export interface ArchivesDetail {
  title: string;
  image: string;
  date: string;
  location: string;
  department: string;
  activity: string;
  photos: string[];
  links: string[];
}

// Figma: 아카이빙 상세 (nodeId 1526:171215)의 내용을 그대로 옮긴 목데이터.
// API 연동 전까지 라우트의 archiveId와 무관하게 이 하나를 보여준다.
// 샘플 사진이 4장뿐이라 번갈아 채운다 — 전부 같은 파일이면 사진이 바뀌는지 눈으로 확인할 수 없다.
const SAMPLE_PHOTOS = [
  freshmanOrientation,
  sportsDay,
  snackEvent,
  alumniPanelTalk,
];

export const ARCHIVES_DETAIL: ArchivesDetail = {
  activity:
    "약 300명의 학생이 참여해서 문화 공연, 체험 부스 등 다양한 프로그램이 진행됐어요. 다 같이 즐기며 알찬 하루를 보냈습니다!",
  date: "2025.05.04 (금)",
  department: "문화기획국",
  image: haeoreumje,
  links: ["해오름제 공지 보러 가기"],
  location: "국민대 농구코트",
  // Figma의 "24장 더보기"(2장 노출 + 24장)에 맞춰 26장
  photos: Array.from(
    { length: 26 },
    (_, index) => SAMPLE_PHOTOS[index % SAMPLE_PHOTOS.length],
  ),
  title: "과소법 해오름제",
};
