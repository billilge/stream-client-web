import type { ArchiveItem } from "@/entities/archives/types";
import type { BililgeItem } from "@/entities/bililge/types";
import type { EventItem } from "@/entities/events/types";
import type { Notice } from "@/entities/notices/types";
import type { Feedback } from "@/features/feedbacks/constants/feedbacks";

// 검색 결과는 카테고리별 배열이다 — 키는 용어 사전(terminology.md)의 코드 용어를 그대로 쓴다.
export interface SearchResults {
  events: EventItem[];
  notices: Notice[];
  feedbacks: Feedback[];
  bililge: BililgeItem[];
  archives: ArchiveItem[];
}
