// Figma: 챗봇 진입 화면의 Suggested Questions(nodeId 1887:91551) — 5개 항목 중 4개가 같은
// mock 텍스트를 그대로 반복하고 있다(디자인 목업 상 placeholder). 실제 추천 질문 콘텐츠는
// API 연동 전까지 이 배열의 값을 그대로 쓴다. 텍스트가 중복돼 렌더링 key로 못 써서 id를 같이 둔다.
export const CHAT_SUGGESTED_QUESTIONS = [
  { id: "student-fee-check-1", text: "학생회비는 어떻게 확인하나요?" },
  { id: "slrangje", text: "슬랑제가 뭔가요?" },
  { id: "student-fee-check-2", text: "학생회비는 어떻게 확인하나요?" },
  { id: "student-fee-check-3", text: "학생회비는 어떻게 확인하나요?" },
  { id: "student-fee-check-4", text: "학생회비는 어떻게 확인하나요?" },
];
