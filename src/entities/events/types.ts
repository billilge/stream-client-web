export type EventStatus = "open" | "upcoming" | "closed";

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  status: EventStatus;
  statusLabel: string;
  actionLabel: string;
  /** 상세 상단 Hero 이미지 개수 — 실 이미지 API 전까지 PageCounter 표기용 */
  imageCount: number;
  /** 상세 메타데이터 "일시" */
  schedule: string;
  /** 상세 메타데이터 "장소" */
  location: string;
  /** 상세 메타데이터 "대상" — Figma가 두 줄로 쪼개 보여줘서 줄 단위로 들고 있는다 */
  audience: string[];
  /** 상세 본문. 줄바꿈을 그대로 살려 렌더링한다 */
  description: string;
}
