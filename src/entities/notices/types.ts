export type NoticeCategory = "일반" | "제휴";

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
}
