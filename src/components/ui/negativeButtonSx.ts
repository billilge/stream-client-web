// 위험한 행동(신청 취소·로그아웃·탈퇴)의 빨간 버튼. WDS Button 색은 primary/assistive뿐이라
// color="primary" 버튼에 Status/Negative 색만 덮는다 — variant마다 덮을 속성이 달라서 둘로 나눈다.
// 색이나 테두리가 바뀌면 여기만 고친다.
export const NEGATIVE_BUTTON_SX = {
  // 테두리 버튼 — 글자와 테두리(WDS outlined는 inset box-shadow로 테두리를 그린다)
  outlined: {
    boxShadow: "inset 0 0 0 1px var(--color-status-negative)",
    color: "var(--color-status-negative)",
  },
  // 채운 버튼 — 배경만(글자는 primary solid의 흰색 그대로)
  solid: { backgroundColor: "var(--color-status-negative)" },
} as const;
