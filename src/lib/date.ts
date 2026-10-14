// 목데이터·API의 날짜("2026-09-05")·일시("2026-09-05T13:59")를 화면 표기로 바꾼다.
// 시간대에 따라 날짜가 밀리지 않게 Date로 파싱하지 않고 문자열을 직접 나눠 읽는다(요일 계산만 Date를 쓴다).

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DateFormatOptions {
  /** 날짜 뒤에 "(토)"처럼 요일을 붙인다 */
  weekday?: boolean;
}

// "2026-09-05" → "2026.09.05", weekday면 "2026.09.05(토)"
export function formatDate(date: string, options: DateFormatOptions = {}) {
  const dotted = date.replaceAll("-", ".");
  if (!options.weekday) {
    return dotted;
  }
  const [year, month, day] = date.split("-").map(Number);
  return `${dotted}(${WEEKDAYS[new Date(year, month - 1, day).getDay()]})`;
}

// "2026-09-05T13:59" → "2026.09.05 13:59", weekday면 "2026.09.05(토) 13:59"
export function formatDateTime(value: string, options: DateFormatOptions = {}) {
  const [date, time] = value.split("T");
  return `${formatDate(date, options)} ${time}`;
}
