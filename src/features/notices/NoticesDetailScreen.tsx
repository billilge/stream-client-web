import { Suspense } from "react";
import { useParams } from "react-router-dom";

import NoticesDetailContent from "@/features/notices/components/NoticesDetailContent";
import NoticesDetailSkeleton from "@/features/notices/components/NoticesDetailSkeleton";
import NoticesNotFound from "@/features/notices/components/NoticesNotFound";
import { NOTICES_PATH } from "@/features/notices/constants/notices";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// 공지 상세 화면 — 이동 같은 화면 동작만 정하고, 공지 데이터를 받는 동안은 상세 배치를 따른
// 스켈레톤을 보여준다. 헤더도 데이터(사진 유무)에 따라 달라서 화면 전체가 데이터 영역이다.
function NoticesDetailScreen() {
  const { noticeId = "" } = useParams<{ noticeId: string }>();
  const noticeNumber = Number(noticeId);
  // 홈 배너·딥링크로 바로 들어오면 돌아갈 화면이 없어서 공지 목록으로 보낸다
  const goBack = useBackNavigation(NOTICES_PATH);

  // 숫자가 아닌 주소는 서버에 보내지 않고 없는 공지로 본다
  if (!Number.isInteger(noticeNumber)) {
    return <NoticesNotFound onBack={goBack} />;
  }

  return (
    <Suspense fallback={<NoticesDetailSkeleton />}>
      <NoticesDetailContent noticeId={noticeNumber} onBack={goBack} />
    </Suspense>
  );
}

export default NoticesDetailScreen;
