import filePencil from "@/assets/icons/events/file-pencil.svg";
import type {
  EventApplyResult,
  EventsTextQuestion,
} from "@/shared/entities/events/eventsTypes";

// 신청서 요약 카드 일러스트 — 서버가 행사별 일러스트를 주지 않아서 Figma(1658:183393)의 그림 하나를 쓴다
export const EVENTS_APPLICATION_ILLUSTRATION = filePencil;

// 완료 화면으로 넘기는 신청 결과(행사 요약). 히스토리에 저장돼 새로고침해도 남고, 주소로 바로 들어오면 없다.
export interface EventsApplicationCompleteState {
  application: Pick<EventApplyResult, "title" | "eventStartAt" | "place">;
}

// Figma 텍스트 입력 예시(nodeId 1133:43105)의 디자이너 메모 — 단답형도 Textarea를 쓰고 50자 제한
export const EVENTS_TEXT_MAX_LENGTH: Record<
  EventsTextQuestion["type"],
  number
> = {
  longAnswer: 500,
  shortAnswer: 50,
};

// 기타 입력칸은 Figma(Other Option, nodeId 1658:183954)에 글자 수 카운터가 없어서 카운터는 안 보이지만,
// 단답형과 같은 50자로 입력을 막는다.
export const EVENTS_OTHER_MAX_LENGTH = 50;

export const EVENTS_OTHER_OPTION_LABEL = "기타";
