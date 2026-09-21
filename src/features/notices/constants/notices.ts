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

// Figma: 공지 상세 (nodeId 1256:81842) 목업 본문 — 목업 데이터라 공지 5건이 본문을 공유한다.
const NOTICE_BODY = `안녕하십니까, 제10대 소프트웨어융합대학 학생회 '에코'입니다.

기말고사를 준비하고 계신 학우 여러분을 응원하기 위해 간식행사를 진행합니다 🍱✨

시험기간 동안 든든하게 힘내시길 바라며, 많은 관심과 참여 부탁드립니다!

📌 간식행사 일정
▪️ 일시 : 6월 1일 (월) 11:00 ~
▪️ 장소 : 미래관 4층 신관 입구 (예대방면)

📌 대상
▪️ 소프트웨어융합대학 재학생 선착순 180명
※ 과학생회비 미납부자 참여 가능

📌 간식행사 메뉴
▪️ 돈까스 도련님 도시락
▪️ 나랑드사이다 제로

📌 유의 사항
▪️ 소프트웨어융합대학 학생임을 증명할 수 있는 모바일 학생증 혹은 실물 학생증을 지참해주시기 바랍니다.
▪️ 1인당 1세트만 수령 가능하며, 선착순 수량 소진 시 수령이 불가능합니다.

많은 학우 여러분의 관심과 참여 부탁드립니다.
감사합니다 😊`;

// Figma: 게시판 - 공지 (nodeId 1256:81776) 목업 데이터
export const NOTICES: Notice[] = [
  {
    body: NOTICE_BODY,
    category: "일반",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "1",
    isPinned: true,
    photoCount: 7,
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    body: NOTICE_BODY,
    category: "일반",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "2",
    photoCount: 3,
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    body: NOTICE_BODY,
    category: "일반",
    date: "2026.09.03",
    id: "3",
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    body: NOTICE_BODY,
    category: "제휴",
    date: "2026.09.03",
    id: "4",
    title: "2026-2학기 사물함 신청 안내",
  },
  {
    body: NOTICE_BODY,
    category: "제휴",
    date: "2026.09.03",
    hasThumbnail: true,
    id: "5",
    photoCount: 4,
    title: "2026-2학기 사물함 신청 안내",
  },
];
