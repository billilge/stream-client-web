import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";

// 가입 완료 — 화면설계서 8번. 체크 로띠가 재생되고 `stream 시작하기`나 상단 닫기(X)는 홈으로 보낸다.
// 신청 완료 화면과 같은 뼈대라 공용 ResultScreen을 쓴다.
function AuthCompleteStep({ onStart }: { onStart: () => void }) {
  return (
    <ResultScreen
      description="stream에 오신 걸 환영해요."
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={onStart}
      primaryAction={{ label: "stream 시작하기", onClick: onStart }}
      title="가입을 완료했어요!"
    />
  );
}

export default AuthCompleteStep;
