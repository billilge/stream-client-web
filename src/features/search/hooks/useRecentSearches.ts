import { useState } from "react";

const STORAGE_KEY = "stream:search:recent";

// Figma 목업은 5개를 보여주지만 상한은 따로 정해진 게 없어서 넉넉히 둔다(저장소가 무한정 커지지만 않게).
const MAX_RECENT_SEARCHES = 10;

function readStoredKeywords(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((value): value is string => typeof value === "string")
      .slice(0, MAX_RECENT_SEARCHES);
  } catch (error) {
    // 저장소가 막혀 있거나(사생활 보호 모드 등) 값이 깨져 있으면 빈 목록으로 시작한다.
    console.warn("최근 검색어를 읽지 못했어요", error);
    return [];
  }
}

function writeStoredKeywords(keywords: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
  } catch (error) {
    // 저장만 포기한다 — 화면 state는 그대로라 이번 방문 동안은 삭제·추가가 정상 동작한다.
    console.warn("최근 검색어를 저장하지 못했어요", error);
  }
}

// 최근 검색어(개별 삭제·전체 삭제 포함, 화면설계서 1번). API가 붙기 전까지의 임시 저장소로
// localStorage를 쓴다 — 새로고침·재진입해도 유지된다. 가장 최근 검색어가 맨 위다.
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] =
    useState<string[]>(readStoredKeywords);

  const update = (next: string[]) => {
    setRecentSearches(next);
    writeStoredKeywords(next);
  };

  const addRecentSearch = (keyword: string) => {
    update(
      [keyword, ...recentSearches.filter((item) => item !== keyword)].slice(
        0,
        MAX_RECENT_SEARCHES,
      ),
    );
  };

  const removeRecentSearch = (keyword: string) => {
    update(recentSearches.filter((item) => item !== keyword));
  };

  const clearRecentSearches = () => {
    update([]);
  };

  return {
    addRecentSearch,
    clearRecentSearches,
    recentSearches,
    removeRecentSearch,
  };
}
