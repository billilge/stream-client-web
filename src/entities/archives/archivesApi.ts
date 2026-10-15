import { ARCHIVES, findArchiveDetail } from "@/entities/archives/archivesMock";
import type { ArchiveDetail, ArchiveItem } from "@/entities/archives/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchArchives(): Promise<ArchiveItem[]> {
  return mockupApi("archives", () => ARCHIVES);
}

// 없는 앨범은 null — 상세·현장 사진 화면이 "존재하지 않는 아카이빙이에요" 빈 상태를 그린다.
export function fetchArchive(archiveId: string): Promise<ArchiveDetail | null> {
  return mockupApi(`archives/${archiveId}`, () => findArchiveDetail(archiveId));
}
