import filePencil from "@/assets/icons/events/file-pencil.svg";

interface EventsQuestionBase {
  id: string;
  title: string;
  isRequired: boolean;
}

export interface EventsChoiceQuestion extends EventsQuestionBase {
  type: "multipleChoice" | "singleChoice";
  options: string[];
}

export interface EventsTextQuestion extends EventsQuestionBase {
  type: "shortAnswer" | "longAnswer";
}

// type 값 이름은 임시 — 백엔드 스펙이 나오면 거기에 맞춘다
export type EventsQuestion = EventsChoiceQuestion | EventsTextQuestion;

// 복수 선택은 string[], 단일 선택·텍스트형은 string
export type EventsAnswer = string | string[];

export interface EventsApplication {
  eventName: string;
  dateTime: string;
  location: string;
  illustration: string;
  questions: EventsQuestion[];
}

// Figma 텍스트 입력 예시(nodeId 1133:43105)의 디자이너 메모 — 단답형도 Textarea를 쓰고 50자 제한
export const EVENTS_TEXT_MAX_LENGTH: Record<
  EventsTextQuestion["type"],
  number
> = {
  longAnswer: 500,
  shortAnswer: 50,
};

// Figma: 행사 신청하기 상세 (nodeId 1133:42457) 문구를 옮긴 목데이터 — 실 API 연동 전까지 사용.
// Figma 선택지는 전부 "텍스트" 플레이스홀더라 선택지 문구는 임의로 채웠고, 단답형 문항은 Figma에
// 없어서 유형 확인용으로 하나 추가했다.
export const EVENTS_APPLICATION: EventsApplication = {
  dateTime: "2026.05.06 17:00",
  eventName: "동문패널톡",
  illustration: filePencil,
  location: "미래관 419호",
  questions: [
    {
      id: "interest",
      isRequired: true,
      options: ["개발", "디자인", "기획"],
      title: "관심 분야를 선택해 주세요.",
      type: "multipleChoice",
    },
    {
      id: "afterParty",
      isRequired: true,
      options: ["참여해요", "참여하지 않아요"],
      title: "뒤풀이에 참여하시나요?",
      type: "singleChoice",
    },
    {
      id: "name",
      isRequired: true,
      title: "이름을 입력해 주세요.",
      type: "shortAnswer",
    },
    {
      id: "question",
      isRequired: false,
      title: "궁금한 점이 있다면 자유롭게 남겨 주세요.",
      type: "longAnswer",
    },
  ],
};
