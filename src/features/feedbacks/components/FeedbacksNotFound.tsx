import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface FeedbacksNotFoundProps {
  onClose: () => void;
}

// 없는 피드백 — 지워졌거나, 남의 질문인데 공개된 답변이 없거나, 주소가 잘못됐다. 서버는 앞의 두 경우를
// 같은 "없음"으로 돌려준다(질문이 있다는 것도 드러내지 않는다).
function FeedbacksNotFound({ onClose }: FeedbacksNotFoundProps) {
  useScreenHeader(
    <ScreenHeader
      trailing={
        <TopNavigationButton aria-label="닫기" onClick={onClose} variant="icon">
          <IconClose />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex flex-1 items-center justify-center">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label1"
        weight="regular"
      >
        존재하지 않는 피드백이에요
      </Typography>
    </div>
  );
}

export default FeedbacksNotFound;
