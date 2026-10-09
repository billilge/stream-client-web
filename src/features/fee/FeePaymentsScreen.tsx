import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeePaymentList from "@/features/fee/components/FeePaymentList";
import FeePaymentsSkeleton from "@/features/fee/components/FeePaymentsSkeleton";
import { STUDENT_COUNCIL_KAKAO_CHANNEL_URL } from "@/features/fee/constants/fee";

// Figma: 학생회비 납부내역 (nodeId 3147:147860 납부확인중, 3147:147879 확인필요, 3147:147841 납부완료)
function FeePaymentsScreen() {
  const navigate = useNavigate();

  // 바로 들어와 뒤로 갈 히스토리가 없으면 홈으로 보낸다
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

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
      title="학생회비 납부내역"
      variant="normal"
    />,
  );

  const openKakaoChannel = () => {
    if (STUDENT_COUNCIL_KAKAO_CHANNEL_URL) {
      window.open(STUDENT_COUNCIL_KAKAO_CHANNEL_URL, "_blank", "noopener");
    }
  };

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<FeePaymentsSkeleton />}>
        <FeePaymentList onContact={openKakaoChannel} />
      </Suspense>
    </div>
  );
}

export default FeePaymentsScreen;
