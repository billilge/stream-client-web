import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ArchivesPhotosContent from "@/features/archives/components/ArchivesPhotosContent";
import ArchivesPhotosSkeleton from "@/features/archives/components/ArchivesPhotosSkeleton";

// Figma: 현장사진 상세 (nodeId 1434:59294)
// 헤더는 데이터와 무관해서 화면이 바로 그리고, 격자 자리만 스켈레톤으로 채운다.
function ArchivesPhotosScreen() {
  const navigate = useNavigate();
  const { archiveId = "" } = useParams<{ archiveId: string }>();

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
      title="현장 사진"
      variant="normal"
    />,
  );

  return (
    <Suspense fallback={<ArchivesPhotosSkeleton />}>
      <ArchivesPhotosContent
        archiveId={archiveId}
        onSelect={(photoIndex) =>
          navigate(`/archives/${archiveId}/photos/${photoIndex}`, {
            viewTransition: true,
          })
        }
      />
    </Suspense>
  );
}

export default ArchivesPhotosScreen;
