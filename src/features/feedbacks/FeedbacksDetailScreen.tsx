import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FeedbacksDetailContent from "@/features/feedbacks/components/FeedbacksDetailContent";
import FeedbacksDetailSkeleton from "@/features/feedbacks/components/FeedbacksDetailSkeleton";
import FeedbacksNotFound from "@/features/feedbacks/components/FeedbacksNotFound";

// 열린피드백 상세(모아보기) 화면 — 이동 같은 화면 동작만 정하고, 데이터를 받는 동안은 상세 배치를 따른
// 스켈레톤을 보여준다. 헤더 제목이 데이터(회차)에 따라 달라서 헤더도 데이터 영역이 등록한다.
function FeedbacksDetailScreen() {
  const navigate = useNavigate();
  const { feedbackId = "" } = useParams();
  const feedbackNumber = Number(feedbackId);
  const goToList = () => navigate("/feedbacks");

  // 숫자가 아닌 주소는 서버에 보내지 않고 없는 피드백으로 본다
  if (!Number.isInteger(feedbackNumber)) {
    return <FeedbacksNotFound onClose={goToList} />;
  }

  return (
    <Suspense fallback={<FeedbacksDetailSkeleton />}>
      <FeedbacksDetailContent feedbackId={feedbackNumber} onClose={goToList} />
    </Suspense>
  );
}

export default FeedbacksDetailScreen;
