import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArchivesDetailContent from "@/features/archives/components/ArchivesDetailContent";
import ArchivesDetailSkeleton from "@/features/archives/components/ArchivesDetailSkeleton";

// 아카이빙 상세 화면 — 이동 같은 화면 동작만 정하고, 데이터를 받는 동안은 상세 배치를 따른
// 스켈레톤을 보여준다. 헤더가 대표 사진 위에 겹치는 화면이라 화면 전체가 데이터 영역이다.
function ArchivesDetailScreen() {
  const navigate = useNavigate();
  const { archiveId = "" } = useParams<{ archiveId: string }>();

  return (
    <Suspense fallback={<ArchivesDetailSkeleton />}>
      <ArchivesDetailContent
        archiveId={archiveId}
        onBack={() => navigate(-1)}
        onMorePhotos={() =>
          navigate(`/archives/${archiveId}/photos`, { viewTransition: true })
        }
      />
    </Suspense>
  );
}

export default ArchivesDetailScreen;
