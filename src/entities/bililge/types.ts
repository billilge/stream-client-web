// BililgeCategoryFilter의 필터 칩과 값을 맞춘다("전체"는 필터 없음을 뜻하는 값이라 제외).
export type BililgeCategory = "전자기기" | "생활잡화" | "상비약" | "위생용품";

export interface BililgeItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
  category: BililgeCategory;
  // 대여 바텀시트의 "대여할 물품" 카드(Figma nodeId 1422:57184, 3013:114608)에 "수량 28 ·
  // {returnDeadlineLabel}"로 붙는 반납 기한 문구 — "오늘 17시까지 반납"/"9/29까지 반납"처럼
  // 오늘·내일·그 이후(월/일)를 서버가 이미 판단해서 내려주는 값이라 가정한다. 오늘/내일 여부는
  // 보는 사람의 로컬 시각 기준이라 프런트에서 계산하는 게 일반적이지만, 이 서비스는 같은 화면을
  // 웹과 앱이 각각 구현해야 해서 "오늘/내일 판단 기준"이 플랫폼마다 어긋나지 않도록 서버가
  // 라벨 문자열까지 계산해서 내려주기로 했다 — 그래서 이 필드는 프런트가 다시 가공하지 않고
  // 그대로 렌더링만 하는 완성된 문자열이다.
  returnDeadlineLabel: string;
}
