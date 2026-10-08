import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NoticesDetailContent from "@/features/notices/components/NoticesDetailContent";
import NoticesDetailSkeleton from "@/features/notices/components/NoticesDetailSkeleton";

// 공지 상세 화면 — 이동 같은 화면 동작만 정하고, 공지 데이터를 받는 동안은 상세 배치를 따른
// 스켈레톤을 보여준다. 헤더도 데이터(사진 유무)에 따라 달라서 화면 전체가 데이터 영역이다.
function NoticesDetailScreen() {
  const navigate = useNavigate();
  const { noticeId = "" } = useParams<{ noticeId: string }>();

  return (
    <Suspense fallback={<NoticesDetailSkeleton />}>
      <NoticesDetailContent noticeId={noticeId} onBack={() => navigate(-1)} />
    </Suspense>
  );
}

export default NoticesDetailScreen;
