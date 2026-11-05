import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import ScreenToast from "@/components/ui/ScreenToast";
import FeeTransferSkeleton from "@/features/fee/components/FeeTransferSkeleton";
import {
  FEE_EXTERNAL_LINKS,
  FEE_PAYMENTS_PATH,
  isAcceptableTranscript,
} from "@/features/fee/constants/fee";
import {
  FEE_TRANSFER_STEP_OPTIONS,
  type FeeTransferSteps,
} from "@/features/fee/constants/feeTransferFunnel";
import FeeTransferCompleteStep from "@/features/fee/steps/FeeTransferCompleteStep";
import FeeTransferConfirmStep from "@/features/fee/steps/FeeTransferConfirmStep";
import FeeTransferSemesterStep from "@/features/fee/steps/FeeTransferSemesterStep";
import FeeTransferTossStep from "@/features/fee/steps/FeeTransferTossStep";
import FeeTransferTranscriptStep from "@/features/fee/steps/FeeTransferTranscriptStep";
import { HOME_PATH } from "@/features/home/constants/home";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { openExternalLink } from "@/lib/openExternalLink";
import { useFunnel, useFunnelExit } from "@/lib/useFunnel";
import { isApiError } from "@/shared/api";
import {
  FEE_ERROR_CODES,
  feeQueries,
  useSubmitFeeMutation,
} from "@/shared/entities/fee/feeQueries";
import { useUploadFileMutation } from "@/shared/entities/files/filesQueries";

// 학생회비 계좌 송금(남은 학기 수 → 학점이수현황 캡처 → 토스 이동 → 송금 확인 → 확인요청 완료)을
// useFunnel 하나로 묶은 화면이다. 단계 화면은 `steps/`에 하나씩 나눠 두고, 이 파일은 단계 전환
// (어느 단계에서 어디로, 무슨 값을 넘기는지)만 맡는다 — 로그인·온보딩 퍼널(AuthSignUpScreen)과 같은 구성이다.
// 단계는 `/fee/transfer?fee.step=...`으로 나뉘고 단계마다 브라우저 뒤로가기가 한 단계씩 돌아간다.
// 단계 사이에 넘기는 값(남은 학기 수·올린 캡처의 파일 키·송금 링크)은 퍼널 context가 들고 있어서
// 뒤로 돌아와도 유지된다. 고른 캡처 파일만은 context(history.state)에 담지 못해서 이 화면이 메모리에 들고
// 있는다(feeTransferFunnel.ts 참고) — 새로고침하면 캡처만 다시 고르면 된다.

// 단계가 바뀌는 이동에만 슬라이드를 켠다 — 학기 수 입력처럼 같은 단계의 context만
// 갈아 끼우는 replace에는 켜지 않는다. 뒤로가기는 React Router가 앞선 이동을 기억해 반대 방향으로
// 자동 적용한다(coding-style.md 라우팅).
const SLIDE = { viewTransition: true };

// 주소에 단계가 없을 때(플로우 진입) 시작 단계. 모듈 스코프에 둬서 useFunnel이 매 렌더마다
// 값을 다시 계산하지 않게 한다.
const INITIAL_STATE = { context: {}, step: "semester" } as const;

// 단계를 넘기지 못했을 때 띄우는 토스트 문구
// 송금 확인 단계의 실패는 이미 송금한 뒤라 "다시 송금하라"로 읽히지 않게 요청 실패로만 안내한다
const TOAST_MESSAGES = {
  invalidProofImage: "캡처를 확인하지 못했어요. 다시 올려 주세요.",
  invalidTranscript: "10MB 이하의 PNG·JPG·WEBP 이미지만 올릴 수 있어요.",
  prepareTossFailed: "다음 단계로 넘어가지 못했어요. 다시 시도해 주세요.",
  submitFailed: "납부 확인 요청에 실패했어요. 다시 시도해 주세요.",
} as const;

function FeeTransferFunnel() {
  const { data: entryFeeStatus } = useSuspenseQuery({
    ...feeQueries.me(),
    select: (fee) => fee.feeStatus,
  });
  // 들어올 때의 상태로만 판단한다 — 납부 요청을 보내면 납부확인중으로 바뀌는데, 그때 완료 단계에서
  // 쫓겨나면 안 된다. 미납·확인필요만 낼 수 있다(서버도 그 외에는 409로 거절한다).
  const [canPay] = useState(
    () => entryFeeStatus === "UNPAID" || entryFeeStatus === "REJECTED",
  );
  // 첫 단계의 뒤로가기 — 타고 들어왔으면 한 단계 뒤로, 플로우로 바로 들어왔으면(딥링크·앱
  // WebView 진입·주소 직접 입력) 홈으로 보낸다. `navigate(-1)`만 쓰면 먹통이 된다(#107 리뷰).
  const goBackFromFlow = useBackNavigation(HOME_PATH);
  // 플로우를 끝내거나 미루고 나갈 때 — 쌓인 단계만큼 되돌아가서, 나간 뒤 뒤로가기로 단계가
  // 되살아나지 않게 한다(#107 리뷰). 퍼널로 바로 들어왔으면 홈으로 치환한다.
  const exitFunnel = useFunnelExit(HOME_PATH);
  const funnel = useFunnel<FeeTransferSteps>({
    id: "fee",
    initial: INITIAL_STATE,
    steps: FEE_TRANSFER_STEP_OPTIONS,
  });
  const queryClient = useQueryClient();
  const { mutateAsync: uploadFile } = useUploadFileMutation();
  const { mutate: submitFee, isPending: isSubmitting } = useSubmitFeeMutation();
  // 고른 캡처 — 단계를 오가도 이 화면은 그대로 떠 있어서 토스에서 돌아와도 남는다
  const [transcript, setTranscript] = useState<File>();
  // 캡처 단계의 "다음" — 캡처를 올리고 송금 링크를 받는 동안 버튼을 막는다
  const [isPreparingToss, setPreparingToss] = useState(false);
  // 마지막으로 올린 캡처와 그 키 — 토스에서 돌아와 같은 파일로 다시 "다음"을 누르면 또 올리지 않는다
  const lastUploadRef = useRef<{ file: File; fileKey: string } | null>(null);
  // 닫힌 뒤에도 마지막 문구를 들고 있어서 닫히는 동안 문구가 바뀌지 않는다.
  // 떠 있는 동안 다시 띄워도 새로 안내되게 key를 올린다(ScreenToast의 key)
  const [toast, setToast] = useState({ isOpen: false, key: 0, message: "" });

  const showToast = (message: string) =>
    setToast((prev) => ({ isOpen: true, key: prev.key + 1, message }));

  const uploadTranscript = async (file: File) => {
    const lastUpload = lastUploadRef.current;
    if (lastUpload?.file === file) {
      return lastUpload.fileKey;
    }
    const fileKey = await uploadFile({
      category: "FEE_TRANSCRIPT_IMAGE",
      file,
    });
    lastUploadRef.current = { file, fileKey };
    return fileKey;
  };

  // 이미 납부 확인을 요청했거나 납부가 끝났으면 송금까지 다 하고 409를 받기 전에 납부내역으로 보낸다
  if (!canPay) {
    return <Navigate replace to={FEE_PAYMENTS_PATH} />;
  }

  return (
    <>
      <funnel.Render
        complete={({ index }) => (
          <FeeTransferCompleteStep onGoHome={() => exitFunnel(index)} />
        )}
        confirm={({ context, history, index }) => (
          <FeeTransferConfirmStep
            isSubmitting={isSubmitting}
            onBack={() => history.back()}
            onConfirm={() =>
              submitFee(
                {
                  proofImageKey: context.proofImageKey,
                  remainingSemesters: context.semester,
                },
                {
                  // 확인 요청을 보내면 송금 확인으로 돌아올 일이 없어서 히스토리를 대체한다
                  onSuccess: () => history.replace("complete", {}, SLIDE),
                  onError: (error) => {
                    // 이미 요청이 들어가 있다 — 응답을 못 받고 다시 누른 경우라 요청은 된 것으로 본다
                    if (
                      isApiError(error) &&
                      error.code === FEE_ERROR_CODES.alreadyRequested
                    ) {
                      history.replace("complete", {}, SLIDE);
                      return;
                    }
                    console.error(error);
                    // 올린 캡처를 서버가 못 찾았다 — 같은 키를 다시 쓰지 않게 비우고 캡처 단계로 돌려보낸다
                    if (
                      isApiError(error) &&
                      error.code === FEE_ERROR_CODES.invalidProofImage
                    ) {
                      lastUploadRef.current = null;
                      showToast(TOAST_MESSAGES.invalidProofImage);
                      history.go(-2);
                      return;
                    }
                    showToast(TOAST_MESSAGES.submitFailed);
                  },
                },
              )
            }
            // 송금을 미루고 나가는 길 — 다음에 들어오면 플로우를 처음부터 다시 탄다
            onPostpone={() => exitFunnel(index)}
          />
        )}
        semester={({ context, history }) => (
          <FeeTransferSemesterStep
            initialSemester={context.semester}
            // 첫 단계라 뒤로가기는 이전 단계가 아니라 플로우 밖(들어온 화면)으로 나간다
            onBack={goBackFromFlow}
            // 단계를 바꾸지 않고 context만 갈아 끼운다(replace)
            onChangeSemester={(semester) =>
              history.replace("semester", { semester })
            }
            onNext={(semester) =>
              history.push("transcript", { semester }, SLIDE)
            }
          />
        )}
        toss={({ context, history }) => (
          <FeeTransferTossStep
            hasTossLink={Boolean(context.transferLinkUrl)}
            onBack={() => history.back()}
            onOpenToss={() => {
              if (!context.transferLinkUrl) {
                return;
              }
              openExternalLink(context.transferLinkUrl);
              // 토스에 다녀오면 돌아올 화면이 송금 확인 단계다. 딥링크가 실제로 열렸는지는
              // 알 수 없어서 열기만 하고 넘긴다 — 송금하지 못했으면 그 단계에서 빠져나간다.
              history.push("confirm", {}, SLIDE);
            }}
          />
        )}
        transcript={({ context, history }) => (
          <FeeTransferTranscriptStep
            isNextPending={isPreparingToss}
            transcript={transcript}
            onBack={() => history.back()}
            onChangeTranscript={(nextTranscript) => {
              if (nextTranscript && !isAcceptableTranscript(nextTranscript)) {
                showToast(TOAST_MESSAGES.invalidTranscript);
                return;
              }
              setTranscript(nextTranscript);
            }}
            // 송금하러 가기 전에 캡처를 올려 둔다 — 업로드가 실패하면 송금 전에 알 수 있다.
            // 송금 링크는 남은 학기 수마다 금액이 달라서 이때 같이 받는다
            onNext={(file) => {
              setPreparingToss(true);
              Promise.all([
                uploadTranscript(file),
                queryClient.fetchQuery(
                  feeQueries.transferGuide(context.semester),
                ),
              ])
                .then(([proofImageKey, { transferLinkUrl }]) =>
                  history.push(
                    "toss",
                    { proofImageKey, transferLinkUrl },
                    SLIDE,
                  ),
                )
                .catch((error: unknown) => {
                  console.error(error);
                  showToast(TOAST_MESSAGES.prepareTossFailed);
                })
                .finally(() => setPreparingToss(false));
            }}
            // 주소를 아직 못 받아서 비어 있을 수 있다 — 빈 주소로 열면 빈 탭이 뜬다
            onOpenGuide={() => {
              if (FEE_EXTERNAL_LINKS.kSmartMentor) {
                openExternalLink(FEE_EXTERNAL_LINKS.kSmartMentor);
              }
            }}
          />
        )}
      />

      <ScreenToast
        key={toast.key}
        message={toast.message}
        onOpenChange={(open) => {
          if (!open) {
            setToast((prev) => ({ ...prev, isOpen: false }));
          }
        }}
        open={toast.isOpen}
      />
    </>
  );
}

// 들어올 때 내 납부 상태부터 받는다 — 받는 동안 첫 단계 모양의 스켈레톤을 보여 준다
function FeeTransferScreen() {
  return (
    <Suspense fallback={<FeeTransferSkeleton />}>
      <FeeTransferFunnel />
    </Suspense>
  );
}

export default FeeTransferScreen;
