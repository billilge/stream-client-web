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
import { useScreenHeader } from "@/components/ui/useScreenHeader";

const FEEDBACKS_QUESTION_MAX_LENGTH = 500;

// Figma: 피드백 질문 (nodeId 1410:49972), 피드백 질문 확인 모달 (nodeId 1410:49980)
// 실제 제출 API 전까지는 확인 모달에서 "보내기"를 누르면 바로 열린피드백 목록으로 보내고,
// 목록 화면에 완료 토스트(Figma nodeId 1410:50080)를 띄우라고 navigate state로 신호를 넘긴다.
function FeedbacksNewScreen() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const headingId = useId();

  const canSubmit = content.trim().length > 0;

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
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
        onConfirm={() =>
          navigate("/feedbacks", {
            replace: true,
            state: { feedbackSent: true },
          })
        }
        open={isConfirmOpen}
        title="피드백을 보낼까요?"
      />
    </div>
  );
}

export default FeedbacksNewScreen;
