import type { ArchiveItem } from "@/shared/entities/archives/archivesTypes";
import type { BililgeItem } from "@/shared/entities/bililge/bililgeTypes";
import type { EventItem } from "@/shared/entities/events/eventsTypes";
import type { Feedback } from "@/shared/entities/feedbacks/feedbacksTypes";
import type { Notice } from "@/shared/entities/notices/noticesTypes";

// 검색 결과는 카테고리별 배열이다 — 키는 용어 사전(terminology.md)의 코드 용어를 그대로 쓴다.
export interface SearchResults {
  events: EventItem[];
  notices: Notice[];
  feedbacks: Feedback[];
  bililge: BililgeItem[];
  archives: ArchiveItem[];
}
