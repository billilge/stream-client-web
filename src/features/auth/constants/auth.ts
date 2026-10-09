import eventsIllustration from "@/assets/images/auth/login-events.png";
import feedbacksIllustration from "@/assets/images/auth/login-feedbacks.png";
import noticesIllustration from "@/assets/images/auth/login-notices.png";

// 인증·온보딩 라우트 경로. 용어 사전(terminology.md)의 공통(`auth`) 아래에 둔다.
export const AUTH_SPLASH_PATH = "/auth/splash";
export const AUTH_LOGIN_PATH = "/auth/login";
export const AUTH_ONBOARDING_PHONE_PATH = "/auth/onboarding/phone";
export const AUTH_ONBOARDING_TERMS_PATH = "/auth/onboarding/terms";
export const AUTH_ONBOARDING_COMPLETE_PATH = "/auth/onboarding/complete";

export function getTermsDetailPath(termsId: TermsId): string {
  return `${AUTH_ONBOARDING_TERMS_PATH}/${termsId}`;
}

// 화면설계서 1번: 중앙 심볼 0~0.45초 → 슬로건·워드마크 0.5~0.9초 → 완성 상태를 잠깐 유지해 총 1.2초.
export const AUTH_SPLASH_DURATION_MS = 1200;

// 연락처 — 숫자 11자리를 모두 입력해야 `다음`이 켜진다(화면설계서 3번).
export const PHONE_DIGIT_COUNT = 11;

export const LOGIN_FAILURE_MESSAGE = "로그인에 실패했어요. 다시 시도해 주세요.";

// Figma 로그인 1~3 — 슬라이드 순서와 문구(nodeId 3658:113051, 3658:113028, 3658:113074)
export const LOGIN_SLIDES = [
  {
    description: "소융대 생활에 필요한 서비스를 한곳에 담았어요.",
    id: "platform",
    image: eventsIllustration,
    title: "소융대 학생을 위한 생활 플랫폼",
  },
  {
    description: "공지와 행사 소식을 stream에서 확인해요.",
    id: "news",
    image: noticesIllustration,
    title: "소프트웨어융합대학의 모든 소식",
  },
  {
    description: "열린피드백으로 의견을 전하고 답변을 받아보세요.",
    id: "feedback",
    image: feedbacksIllustration,
    title: "내 의견을 소융대와 더 가까이",
  },
] as const;

export type TermsId = "service" | "privacy" | "notifications";

export const TERMS_IDS: TermsId[] = ["service", "privacy", "notifications"];

export function isTermsId(value: string | undefined): value is TermsId {
  return TERMS_IDS.some((id) => id === value);
}

interface TermsSection {
  title: string;
  /** 문단이면 문자열 하나, 항목 나열이면 문자열 배열(점 목록)이다 */
  body: string | string[];
}

interface Terms {
  /** 동의 목록 행에 쓰는 라벨(앞에 [필수]/[선택]이 붙는다) */
  label: string;
  /** 약관 상세 화면의 헤더 제목 */
  title: string;
  isRequired: boolean;
  sections: TermsSection[];
}

// Figma 온보딩의 약관 상세 3종(nodeId 3738:73022, 3738:73116, 3738:73209) 본문이다. 실제 약관 문구와
// 게시 방식(서버·정적 문서)이 정해지면 교체한다.
export const TERMS: Record<TermsId, Terms> = {
  notifications: {
    isRequired: false,
    label: "선택적 정보 알림 수신 동의",
    sections: [
      {
        body: "행사 신청 일정·결과, 대여 및 반납 안내, 사물함 이용 안내, 공지사항과 학생회 활동 소식 등 Stream에서 제공하는 정보 알림을 받을 수 있어요.",
        title: "수신 동의 항목",
      },
      {
        body: "기기의 푸시 알림을 통해 안내해요. 알림 권한이 꺼져 있으면 메시지가 표시되지 않을 수 있으며, 기기 설정에서 권한을 변경할 수 있어요.",
        title: "수신 방법",
      },
      {
        body: "정보 알림 수신 동의는 선택 사항이에요. 동의하지 않아도 Stream의 기본 서비스 이용에는 제한이 없어요.",
        title: "동의 거부 권리",
      },
      {
        body: "언제든지 stream 알림 설정에서 알림을 끄거나, 기기 설정에서 stream의 알림 권한을 변경해 철회할 수 있어요.",
        title: "동의 철회 방법",
      },
      {
        body: "알림 수신 동의 정보는 동의 철회 또는 회원 탈퇴 시까지 보유해요. 다만 법령에 따라 보관이 필요한 경우에는 해당 기간 동안 보관할 수 있어요.",
        title: "보유 및 이용 기간",
      },
    ],
    title: "선택적 정보 알림 수신 동의",
  },
  privacy: {
    isRequired: true,
    label: "개인정보 수집 및 이용 동의",
    sections: [
      {
        body: [
          "필수 항목: 학번, 이름, 이메일, 휴대전화번호",
          "서비스 이용 중 생성: 사물함/물품 대여 이력, 행사 신청 내역, 피드백 작성 내용",
        ],
        title: "수집하는 개인정보 항목",
      },
      {
        body: "회원 본인 확인, 사물함·물품(빌릴게) 대여 신청 및 반납 관리, 행사 신청자 확인, 열린피드백 작성자 식별, 공지사항 및 서비스 안내 전달을 위해 이용해요.",
        title: "수집 및 이용 목적",
      },
      {
        body: "회원 탈퇴 시 즉시 파기하는 것을 원칙으로 해요. 단, 대여 이력 등 분쟁 방지를 위해 필요한 항목은 관련 규정에 따라 최대 1년간 보관 후 파기해요.",
        title: "보유 및 이용 기간",
      },
      {
        body: "수집한 개인정보는 원칙적으로 외부에 제공하지 않아요. AI 챗봇 응답 생성을 위해 외부 AI 사업자에게 질의 내용이 전달될 수 있으며, 이 경우 위탁받는 자와 위탁 업무 내용을 별도로 고지해요.",
        title: "제3자 제공 및 처리위탁",
      },
      {
        body: "이용자는 개인정보 수집·이용에 동의하지 않을 권리가 있어요. 다만 필수 항목에 동의하지 않으면 Stream 회원가입 및 대여·신청 서비스 이용이 제한될 수 있어요.",
        title: "동의 거부 권리 및 불이익",
      },
    ],
    title: "개인정보 수집 및 이용 동의",
  },
  service: {
    isRequired: true,
    label: "서비스 이용약관 동의",
    sections: [
      {
        body: "본 약관은 소프트웨어융합대학 학생회가 운영하는 stream 서비스의 이용 조건과 절차, 이용자와 운영자의 권리·의무를 정하는 것을 목적으로 해요.",
        title: "제1조 목적",
      },
      {
        body: "stream은 공지 확인, 행사 신청, 물품 대여, 사물함 신청·이용, 열린피드백 등 소프트웨어융합대학 학생회 관련 서비스를 제공해요.",
        title: "제2조 서비스 내용",
      },
      {
        body: "이용자는 정확한 정보를 입력하고, 타인의 계정을 이용하거나 부정한 신청·대여를 해서는 안 돼요. 서비스 운영을 방해하는 행위도 제한돼요.",
        title: "제3조 이용자 의무",
      },
      {
        body: "운영상 필요하거나 약관을 위반한 경우 서비스 이용이 제한될 수 있어요. 제한 사유와 기간은 가능한 범위에서 앱 또는 개별 안내로 알려드려요.",
        title: "제4조 서비스 이용 제한",
      },
      {
        body: "약관이 변경되는 경우 적용일 전 앱에서 안내해요. 서비스 이용 중 문의사항은 Stream 내 문의 채널 또는 학생회에 알려 주세요.",
        title: "제5조 약관 변경 및 문의",
      },
    ],
    title: "서비스 이용약관",
  },
};
