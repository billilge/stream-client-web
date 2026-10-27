import { useNavigate } from "react-router-dom";

import { FEE_EXTERNAL_LINKS } from "@/features/fee/constants/fee";
import {
  FEE_TRANSFER_STEP_OPTIONS,
  type FeeTransferSteps,
} from "@/features/fee/constants/feeTransferFunnel";
import FeeTransferCompleteStep from "@/features/fee/steps/FeeTransferCompleteStep";
import FeeTransferConfirmStep from "@/features/fee/steps/FeeTransferConfirmStep";
import FeeTransferSemesterStep from "@/features/fee/steps/FeeTransferSemesterStep";
import FeeTransferTossStep from "@/features/fee/steps/FeeTransferTossStep";
import FeeTransferTranscriptStep from "@/features/fee/steps/FeeTransferTranscriptStep";
import { openExternalLink } from "@/lib/openExternalLink";
import { useFunnel, useFunnelExit } from "@/lib/useFunnel";

// 학생회비 계좌 송금(남은 학기 수 → 학점이수현황 캡처 → 토스 이동 → 송금 확인 → 확인요청 완료)을
// useFunnel 하나로 묶은 화면이다. 단계 화면은 `steps/`에 하나씩 나눠 두고, 이 파일은 단계 전환
// (어느 단계에서 어디로, 무슨 값을 넘기는지)만 맡는다 — 로그인·온보딩 퍼널(AuthSignupScreen)과 같은 구성이다.
// 단계는 `/fee/transfer?fee.step=...`으로 나뉘고 단계마다 브라우저 뒤로가기가 한 단계씩 돌아간다.
// 단계 사이에 넘기는 값(남은 학기 수·캡처 이미지)은 퍼널 context가 들고 있어서 뒤로 돌아와도 유지된다.

// 단계가 바뀌는 이동에만 슬라이드를 켠다 — 학기 수 입력·파일 선택처럼 같은 단계의 context만
// 갈아 끼우는 replace에는 켜지 않는다. 뒤로가기는 React Router가 앞선 이동을 기억해 반대 방향으로
// 자동 적용한다(coding-style.md 라우팅).
const SLIDE = { viewTransition: true };

// 주소에 단계가 없을 때(플로우 진입) 시작 단계. 모듈 스코프에 둬서 useFunnel이 매 렌더마다
// 값을 다시 계산하지 않게 한다.
const INITIAL_STATE = { context: {}, step: "semester" } as const;

function FeeTransferScreen() {
  const navigate = useNavigate();
  // 플로우를 끝내거나 미루고 나갈 때 — 쌓인 단계만큼 되돌아가서, 나간 뒤 뒤로가기로 단계가
  // 되살아나지 않게 한다(#107 리뷰). 퍼널로 바로 들어왔으면 홈으로 치환한다.
  const exitFunnel = useFunnelExit("/");
  const funnel = useFunnel<FeeTransferSteps>({
    id: "fee",
    initial: INITIAL_STATE,
    steps: FEE_TRANSFER_STEP_OPTIONS,
  });

  return (
    <funnel.Render
      complete={({ index }) => (
        <FeeTransferCompleteStep onGoHome={() => exitFunnel(index)} />
      )}
      confirm={({ history, index }) => (
        <FeeTransferConfirmStep
          onBack={() => history.back()}
          // 확인 요청을 보내면 송금 확인으로 돌아올 일이 없어서 히스토리를 대체한다
          onConfirm={() => history.replace("complete", {}, SLIDE)}
          // 송금을 미루고 나가는 길 — 다음에 들어오면 플로우를 처음부터 다시 탄다
          onPostpone={() => exitFunnel(index)}
        />
      )}
      semester={({ context, history }) => (
        <FeeTransferSemesterStep
          initialSemester={context.semester}
          // 첫 단계라 뒤로가기는 이전 단계가 아니라 플로우 밖(들어온 화면)으로 나간다
          onBack={() => navigate(-1)}
          // 단계를 바꾸지 않고 context만 갈아 끼운다(replace)
          onChangeSemester={(semester) =>
            history.replace("semester", { semester })
          }
          onNext={(semester) => history.push("transcript", { semester }, SLIDE)}
        />
      )}
      toss={({ history }) => (
        <FeeTransferTossStep
          hasTossLink={Boolean(FEE_EXTERNAL_LINKS.tossTransfer)}
          onBack={() => history.back()}
          onOpenToss={() => {
            openExternalLink(FEE_EXTERNAL_LINKS.tossTransfer);
            // 토스에 다녀오면 돌아올 화면이 송금 확인 단계다. 딥링크가 실제로 열렸는지는
            // 알 수 없어서 열기만 하고 넘긴다 — 송금하지 못했으면 그 단계에서 빠져나간다.
            history.push("confirm", {}, SLIDE);
          }}
        />
      )}
      transcript={({ context, history }) => (
        <FeeTransferTranscriptStep
          initialTranscript={context.transcript}
          onBack={() => history.back()}
          // 단계를 바꾸지 않고 context만 갈아 끼운다(replace) — 토스를 다녀와도 고른 파일이 남는다
          onChangeTranscript={(transcript) =>
            history.replace("transcript", (prev) => ({ ...prev, transcript }))
          }
          onNext={(transcript) => history.push("toss", { transcript }, SLIDE)}
          // 주소를 아직 못 받아서 비어 있을 수 있다 — 빈 주소로 열면 빈 탭이 뜬다
          onOpenGuide={() => {
            if (FEE_EXTERNAL_LINKS.kSmartMentor) {
              openExternalLink(FEE_EXTERNAL_LINKS.kSmartMentor);
            }
          }}
        />
      )}
    />
  );
}

export default FeeTransferScreen;
