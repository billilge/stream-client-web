import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { ARCHIVES_DETAIL } from "@/features/archives/constants/archivesDetail";

// Figma: 현장사진 상세 (nodeId 1434:59294)
// Figma는 회색 placeholder 칸이라, 상세 화면과 같은 목업 사진 목록으로 채운다(archiveId와 무관).
function ArchivesPhotosScreen() {
  const navigate = useNavigate();
  const { archiveId } = useParams();
  const { photos } = ARCHIVES_DETAIL;

  useScreenHeader(
    // ScreenLayout 기본 배경은 alternative(회색)라, Figma의 흰 배경(Background/Normal/Normal)을 화면이 직접 깐다.
    <div className="bg-background-normal">
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
      />
    </div>,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto bg-background-normal">
      {/* pt-2: Figma Body gap(Top Navigation ↔ Photo Grid 8px)
          sm:pb-[34px]: Figma 하단 Home Bar 여백 — 앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 둔다 */}
      <div className="grid grid-cols-2 gap-2 px-5 pt-2 pb-4 sm:pb-[34px]">
        {photos.map((photo, index) => (
          <button
            className="overflow-hidden rounded-xl"
            // biome-ignore lint/suspicious/noArrayIndexKey: 같은 사진이 여러 장일 수 있고, 사진 목록은 순서가 바뀌지 않는다
            key={index}
            onClick={() => navigate(`/archives/${archiveId}/photos/${index}`)}
            type="button"
          >
            <img
              alt=""
              className="aspect-square w-full object-cover"
              src={photo}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArchivesPhotosScreen;
