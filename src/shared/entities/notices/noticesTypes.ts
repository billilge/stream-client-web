export type NoticeCategory = "일반" | "제휴";

export interface NoticeAttachment {
  id: string;
  /** 확장자를 포함한 원래 파일 이름 — 내려받을 때 저장 이름으로도 쓴다. */
  name: string;
  /** 바이트 단위 */
  size: number;
  url: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  isPinned?: boolean;
  hasThumbnail?: boolean;
  /** 상세 화면 이미지 갤러리 총 장수 — hasThumbnail일 때만 의미가 있다. */
  photoCount?: number;
  body: string;
  attachments?: NoticeAttachment[];
}
