import type { PreviewResponse } from "@/shared/api";

// 서버 학생 앱 홈 API(GET /v1/app/home) 응답 모양 그대로다 — 화면 모양은 화면 쪽에서 바꾼다.
// 일시는 서버 LocalDateTime 문자열("2026-06-04T18:30:00"), 날짜는 LocalDate 문자열("2026-06-04")이다.

// 배너를 눌렀을 때 가는 곳(서버 HomeBannerLandingType). 서버가 짝이 어긋난 배너는 빼고 줘서
// 공지·행사는 targetId가, 외부 링크는 linkUrl이 항상 있다.
type HomeBannerLanding =
  | { landingType: "NOTICE" | "EVENT"; targetId: number; linkUrl: null }
  | { landingType: "EXTERNAL_LINK"; targetId: null; linkUrl: string };

// 상단 배너 한 건. 연결한 공지·행사가 지워졌거나 미게시인 배너는 서버가 뺀다
export type HomeBanner = {
  bannerId: number;
  /** 줄바꿈(\n)이 들어갈 수 있다 */
  title: string;
  subtitle: string | null;
  /** 카드 전체 배경 — 운영진이 고른 카테고리의 정해진 이미지나 직접 올린 이미지다. 파일이 지워졌으면 null */
  imageUrl: string | null;
} & HomeBannerLanding;

// 신청 안내 카드의 대상(서버 HomeApplyTargetType). 행사는 행사 하나, 사물함은 운영 회차 하나다
export type HomeApplyTargetType = "EVENT" | "LOCKER";

// 신청 안내 카드 한 건. 운영진이 노출한 것 중 지금 신청할 수 있는 것만 온다(마감·미게시는 서버가 뺀다)
export interface HomeApplySection {
  targetType: HomeApplyTargetType;
  /** 행사 ID 또는 사물함 운영 회차 ID */
  targetId: number;
  title: string;
  applyEndAt: string;
  /** 이 학생이 이미 신청했는지 */
  isApplied: boolean;
}

// 반납해야 하는 대여 한 건. 홈 대여 현황은 반납 대기·확인을 나눠 보여 주려고 빌릴게 반납 API를 쓴다 — 화면은 이 값을 쓰지 않는다
export interface HomeRental {
  rentalId: number;
  itemName: string;
  itemImageUrl: string | null;
  dueAt: string;
  isOverdue: boolean;
  /** 반납 승인 대기·확인(RETURN_PENDING·RETURN_CONFIRMED)이면 true */
  isReturnRequested: boolean;
}

// 신청한 행사 한 건 — 오늘이나 그 뒤에 열리는 행사만 온다
export interface HomeAppliedEvent {
  eventId: number;
  title: string;
  /** 행사일(LocalDate) */
  eventDate: string;
}

// 학생회비 납부 상태(서버 HomeStudentFeeStatus). 납부를 신청한 적이 없으면 UNPAID다
export type HomeStudentFeeStatus = "UNPAID" | "PENDING" | "PAID" | "REJECTED";

// 사물함 배정 상태(서버 HomeLockerStatus). 신청한 적이 없으면 NOT_APPLIED다
export type HomeLockerStatus = "NOT_APPLIED" | "ASSIGNED" | "EXPIRED";

// 홈 화면 전체(GET /v1/app/home). 섹션이 비어도 필드는 빠지지 않는다.
// 대여·신청한 행사는 앞의 2건과 전체 수만 온다.
export interface HomeResponse {
  banners: HomeBanner[];
  applySections: HomeApplySection[];
  rentals: PreviewResponse<HomeRental>;
  appliedEvents: PreviewResponse<HomeAppliedEvent>;
  studentFee: { status: HomeStudentFeeStatus };
  /** 작성한 열린피드백 질문 수 */
  openFeedback: { writtenCount: number };
  /** lockerNumber는 배정된 사물함 이름으로, ASSIGNED일 때만 있다 */
  locker: { status: HomeLockerStatus; lockerNumber: string | null };
}
