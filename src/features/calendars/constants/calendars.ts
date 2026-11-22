export const CALENDARS_PATH = "/calendars";

// 홈 주간 카드의 "N건 더보기"가 보던 날짜를 넘긴다. 새로고침·뒤로가기에도 같은 날짜로 열리도록 history state가 아니라 주소에 싣는다
export const CALENDARS_DATE_PARAM = "date";

export function getCalendarsPath(date?: string) {
  return date
    ? `${CALENDARS_PATH}?${CALENDARS_DATE_PARAM}=${date}`
    : CALENDARS_PATH;
}
