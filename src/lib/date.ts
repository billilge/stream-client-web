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

// 서버 일시("2026-11-04T17:00:00")까지 남은 시간(시간 단위). 지났으면 음수다.
// 남은 시간은 올리고(30분 남으면 1시간) 지난 시간은 내려서, 어느 쪽이든 0시간으로 보이지 않게 1시간부터 센다.
// 서버 일시는 오프셋 없는 KST라 기기 시간대 기준 일시로 읽는다.
export function getHoursUntil(value: string, now: Date = new Date()): number {
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const diffMs =
    new Date(year, month - 1, day, hour, minute).getTime() - now.getTime();
  const hours = diffMs / (60 * 60 * 1000);
  return hours > 0 ? Math.ceil(hours) : -Math.max(1, Math.floor(-hours));
}

// "2026-09-05T13:59" → "2026.09.05 13:59", weekday면 "2026.09.05(토) 13:59"
export function formatDateTime(value: string, options: DateFormatOptions = {}) {
  const [date, time] = value.split("T");
  return `${formatDate(date, options)} ${time}`;
}
