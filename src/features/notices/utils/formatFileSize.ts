const UNITS = ["B", "KB", "MB", "GB"];

// B는 정수 그대로, KB 이상은 소수 첫째 자리까지(정수면 생략)
function roundSize(size: number, unitIndex: number) {
  return unitIndex === 0 ? size : Math.round(size * 10) / 10;
}

// 첨부파일 용량 표시 — 1024 단위로 올린다. 반올림한 값으로 단위를 정해야 1,048,575B가
// "1024KB"가 아니라 "1MB"가 된다.
export function formatFileSize(bytes: number): string {
  let size = bytes;
  let unitIndex = 0;
  while (roundSize(size, unitIndex) >= 1024 && unitIndex < UNITS.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${roundSize(size, unitIndex)}${UNITS[unitIndex]}`;
}
