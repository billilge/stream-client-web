import {
  ActionArea,
  ActionAreaButton,
  TextArea,
  TextAreaContent,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  FEEDBACK_NOT_OPEN_MESSAGE,
  FEEDBACK_SEND_FAILURE_MESSAGE,
} from "@/features/feedbacks/constants/feedbacks";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { isApiError } from "@/shared/api";
import {
  FEEDBACK_ERROR_CODES,
  useCreateFeedbackMutation,
} from "@/shared/entities/feedbacks/feedbacksQueries";

const FEEDBACKS_QUESTION_MAX_LENGTH = 500;

// Figma: 피드백 질문 (nodeId 1410:49972), 피드백 질문 확인 모달 (nodeId 1410:49980)
// 확인 모달에서 "보내기"를 누르면 질문을 서버에 보내고, 성공하면 열린피드백 목록으로 이동하면서
// 목록 화면에 완료 토스트(Figma nodeId 1410:50080)를 띄우라고 navigate state로 신호를 넘긴다.
// 실패하면 모달을 닫고 작성 화면에 머물러서 쓴 내용을 지키고, 토스트로 이유를 알린다(Figma에 없는 안내다).
function FeedbacksNewScreen() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  // 실패가 연달아 나도 스크린리더가 토스트를 다시 안내하도록 실패마다 ScreenToast를 새로 마운트한다
  const [toastToken, setToastToken] = useState(0);
  const { mutate: createFeedback, isPending } = useCreateFeedbackMutation();
  const headingId = useId();

  const canSubmit = content.trim().length > 0;

  const handleSend = () => {
    // 두 번 눌러도 질문이 두 번 등록되지 않게 한다
    if (isPending) {
      return;
    }
    createFeedback(content.trim(), {
      onError: (error) => {
        setIsConfirmOpen(false);
        setFailureMessage(
          isApiError(error) && error.code === FEEDBACK_ERROR_CODES.notOpen
            ? FEEDBACK_NOT_OPEN_MESSAGE
            : FEEDBACK_SEND_FAILURE_MESSAGE,
        );
        setToastToken((token) => token + 1);
      },
      onSuccess: () =>
        navigate("/feedbacks", {
          replace: true,
          state: { feedbackSent: true },
        }),
    });
  };

  const goBack = useBackNavigation("/feedbacks");

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="피드백 작성"
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 px-5 pt-2">
          <Typography
            color="semantic.label.neutral"
            id={headingId}
            variant="label1"
            weight="bold"
          >
            궁금하거나 건의하고 싶은 내용을 자유롭게 적어 주세요.
          </Typography>
          <TextArea
            aria-labelledby={headingId}
            aria-required="true"
            maxLength={FEEDBACKS_QUESTION_MAX_LENGTH}
            minRows={1}
            onChange={(event) => setContent(event.target.value)}
            placeholder="피드백 내용을 입력하세요."
            trailingContent={
              <TextAreaContent variant="characterCounter">
                {FEEDBACKS_QUESTION_MAX_LENGTH}
              </TextAreaContent>
            }
            value={content}
            width="100%"
          />
        </div>
      </div>

      <div className="shrink-0">
        <ActionArea background>
          <ActionAreaButton
            disabled={!canSubmit}
            onClick={() => setIsConfirmOpen(true)}
            sx={{ paddingBlock: "16px" }}
          >
            피드백 보내기
          </ActionAreaButton>
        </ActionArea>
        <div className="h-safe-bottom-extra bg-background-elevated-normal sm:h-[14px]" />
      </div>

      <ConfirmModal
        cancelLabel="수정"
        confirmLabel="보내기"
        description="보내 주신 피드백은 정기 답변에서 함께 답변해 드려요."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleSend}
        open={isConfirmOpen}
        title="피드백을 보낼까요?"
      />

      <ScreenToast
        key={toastToken}
        message={failureMessage ?? ""}
        onOpenChange={(open) => {
          if (!open) {
            setFailureMessage(null);
          }
        }}
        open={failureMessage !== null}
      />
    </div>
  );
}

export default FeedbacksNewScreen;
