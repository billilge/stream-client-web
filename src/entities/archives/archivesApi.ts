import { queryOptions } from "@tanstack/react-query";

import { ARCHIVES, findArchiveDetail } from "@/entities/archives/archivesMock";
import { mockupResponse } from "@/lib/mockupApi";

const archivesKeys = {
  root: () => ["archives"] as const,
  list: () => [...archivesKeys.root(), "list"] as const,
  detail: (archiveId: string) =>
    [...archivesKeys.root(), "detail", archiveId] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const archivesQueries = {
  list: () =>
    queryOptions({
      queryKey: archivesKeys.list(),
      queryFn: () => mockupResponse(() => ARCHIVES),
    }),
  // 없는 앨범은 null — 상세·현장 사진 화면이 "존재하지 않는 아카이빙이에요" 빈 상태를 그린다.
  detail: (archiveId: string) =>
    queryOptions({
      queryKey: archivesKeys.detail(archiveId),
      queryFn: () => mockupResponse(() => findArchiveDetail(archiveId)),
    }),
};
