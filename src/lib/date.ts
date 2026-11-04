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

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export interface TimeUntil {
  // 지났으면 음수다
  amount: number;
  unit: "hours" | "days";
}

// 서버 일시("2026-11-04T17:00:00")까지 남은 시간. 24시간이 안 남았거나 안 지났으면 시간 단위로, 그 밖은 일 단위로 센다.
// - 시간: 남은 시간은 올리고(30분 남으면 1시간) 지난 시간은 내려서, 어느 쪽이든 0시간으로 보이지 않게 1시간부터 센다.
// - 일: 시간을 24로 나누지 않고 날짜 차이로 센다. 반납 마감처럼 "어느 날 몇 시"인 일시는 1일이 내일, 2일이 모레로
//   읽혀야 해서다 — 24로 나눠 내리면 모레 마감(47시간)이 1일, 올리면 내일 마감(25시간)이 2일이 된다.
// 서버 일시는 오프셋 없는 KST라 기기 시간대 기준 일시로 읽는다.
export function getTimeUntil(value: string, now: Date = new Date()): TimeUntil {
  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const hours =
    (new Date(year, month - 1, day, hour, minute).getTime() - now.getTime()) /
    HOUR_MS;

  if (Math.abs(hours) < 24) {
    return {
      amount: hours > 0 ? Math.ceil(hours) : -Math.max(1, Math.floor(-hours)),
      unit: "hours",
    };
  }
  // 24시간 넘게 떨어져 있으면 자정을 한 번 이상 지나서 날짜 차이가 1일 이상이다. 서머타임이 없어도 반올림으로 날짜를 맞춘다
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    amount: Math.round(
      (new Date(year, month - 1, day).getTime() - today.getTime()) / DAY_MS,
    ),
    unit: "days",
  };
}

// "2026-08-10"(일시면 날짜 부분) → "8월 10일", weekday면 "8월 10일 (월)"
export function formatMonthDay(value: string, options: DateFormatOptions = {}) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const monthDay = `${month}월 ${day}일`;
  if (!options.weekday) {
    return monthDay;
  }
  return `${monthDay} (${WEEKDAYS[new Date(year, month - 1, day).getDay()]})`;
}

// 서버 날짜("2026-09-05")나 일시("2026-09-05T13:59")의 날짜까지 남은 날을 "D-3"으로, 당일은 "D-Day"로 쓴다
// (행사 목록 배지와 같은 표기). 시각은 보지 않고 날짜 차이로 센다.
export function formatDday(value: string, now: Date = new Date()) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round(
    (new Date(year, month - 1, day).getTime() - today.getTime()) / DAY_MS,
  );
  return days === 0 ? "D-Day" : `D-${days}`;
}

// "2026-09-05T13:59" → "2026.09.05 13:59", weekday면 "2026.09.05(토) 13:59"
// 서버(LocalDateTime)는 초와 소수 초까지 내려 주므로("13:59:00.123456") 시:분까지만 남긴다
export function formatDateTime(value: string, options: DateFormatOptions = {}) {
  const [date, time] = value.split("T");
  return `${formatDate(date, options)} ${time.slice(0, 5)}`;
}
