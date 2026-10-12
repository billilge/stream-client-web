import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArchivesPhotoViewerContent from "@/features/archives/components/ArchivesPhotoViewerContent";

// Figma: 현장 사진 하나 클릭 시 (nodeId 1526:171364)
// 사진 한 장을 꽉 채우는 화면이라 스켈레톤 대신 빈 화면을 두고, 사진이 오면 그대로 그린다.
function ArchivesPhotoViewerScreen() {
  const navigate = useNavigate();
  const { archiveId = "", photoIndex = "0" } = useParams<{
    archiveId: string;
    photoIndex: string;
  }>();

  return (
    <Suspense fallback={<div className="flex-1" />}>
      <ArchivesPhotoViewerContent
        archiveId={archiveId}
        onClose={() => navigate(-1)}
        photoIndex={photoIndex}
      />
    </Suspense>
  );
}

export default ArchivesPhotoViewerScreen;
