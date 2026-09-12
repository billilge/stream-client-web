export type NoticeCategory = "일반" | "제휴";

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  isPinned?: boolean;
  hasThumbnail?: boolean;
}

// Figma: 게시판 - 공지 (nodeId 1256:81776) 목업 데이터
export const NOTICES: Notice[] = [
  {
    category: "일반",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "1",
    isPinned: true,
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    category: "일반",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "2",
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    category: "일반",
    date: "2026.09.03",
    id: "3",
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    category: "제휴",
    date: "2026.09.03",
    id: "4",
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    category: "제휴",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "5",
    title: "2026-2학기 사물함 신청 안내",
  },
];
