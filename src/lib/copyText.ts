// 글자를 클립보드에 복사하고 성공했는지 돌려준다(학생회비 계좌번호 복사 등).
// `navigator.clipboard`는 보안 컨텍스트와 권한이 있어야 해서 앱 WebView처럼 막히는 곳이 있다 —
// 막히면 숨긴 textarea를 골라 `document.execCommand("copy")`로 한 번 더 시도한다.
// 둘 다 실패하면 false라서, 부르는 쪽이 복사할 값을 화면에 직접 보여 줘야 한다.
// 사용자가 누른 그 이벤트 안에서 불러야 한다 — 다른 요청을 기다린 뒤에 부르면 브라우저가 막는다.
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithTextarea(text);
  }
}

function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  // 모바일에서 키보드가 올라오거나 화면이 움직이지 않게 읽기 전용으로 화면 밖에 둔다
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
