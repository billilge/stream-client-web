import freshmanOrientation from "@/assets/images/archives/freshman-orientation.jpg";
import haeoreumje from "@/assets/images/archives/haeoreumje.jpg";

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
export const ARCHIVES_DETAIL: ArchivesDetail = {
  activity:
    "약 300명의 학생이 참여해서 문화 공연, 체험 부스 등 다양한 프로그램이 진행됐어요. 다 같이 즐기며 알찬 하루를 보냈습니다!",
  date: "2025.05.04 (금)",
  department: "문화기획국",
  image: haeoreumje,
  links: ["해오름제 공지 보러 가기"],
  location: "국민대 농구코트",
  // Figma의 "24장 더보기"(2장 노출 + 24장)에 맞춰 26장 — 현장 사진은 모두 같은 샘플 이미지다
  photos: Array.from({ length: 26 }, () => freshmanOrientation),
  title: "과소법 해오름제",
};
