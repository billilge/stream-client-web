import { IconButton } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PhotoGallery from "@/components/ui/PhotoGallery";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { ARCHIVES_DETAIL } from "@/features/archives/constants/archivesDetail";

// Figma: 현장 사진 하나 클릭 시 (nodeId 1526:171364)
// 넘기기·카운터는 공지/행사 상세와 같은 공용 PhotoGallery를 쓰고, 이 화면만의 흐린 배경과
// 닫기 버튼을 background/overlay 슬롯으로 넘긴다. 세게 밀어도 한 장만 넘어가도록 snapStop을 켠다.
// 사진 목록은 API 연동 전까지 archiveId와 무관하게 상세 화면과 같은 목업을 쓴다.
function ArchivesPhotoViewerScreen() {
  const navigate = useNavigate();
  const { archiveId, photoIndex } = useParams();
  const { title, photos } = ARCHIVES_DETAIL;

  // 주소의 photoIndex가 숫자가 아니거나 범위를 벗어나면 첫 장/마지막 장으로 맞춘다
  const initialIndex = Math.min(
    Math.max(Number(photoIndex) || 0, 0),
    photos.length - 1,
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <div className="relative flex-1 overflow-hidden">
      <PhotoGallery
        background={
          /* Figma Background blur — 현재 사진을 크게 흐리게 깔아 위아래 빈 공간을 채운다.
             Figma의 711×877 고정값 대신 화면을 채우고 확대하는 방식으로 둔다 — 앱 WebView는 높이가
             제각각이라 고정 픽셀이면 긴 화면에서 위아래에 빈 띠가 남는다(375×812 프레임 기준 값이었다).
             슬라이드의 같은 사진이 이름을 가지므로 여기는 장식으로 둔다(alt=""). */
          <img
            alt=""
            className="absolute inset-0 size-full scale-150 object-cover blur-[21.55px]"
            src={photos[currentIndex]}
          />
        }
        className="h-full"
        counterAlternative
        /* Figma Page Indicator/Counter — 화면 하단에서 47px 위, 가운데 */
        counterClassName="inset-x-0 bottom-[47px] flex justify-center"
        idPrefix={`archives-${archiveId}`}
        initialPage={initialIndex + 1}
        onPageChange={(page) => setCurrentIndex(page - 1)}
        overlay={
          // 슬라이드 영역이 화면을 꽉 채우므로, 헤더는 absolute로 그 위에 띄운다
          <div className="absolute inset-x-0 top-0 z-10">
            <ScreenHeader
              trailing={
                // 어두운 사진이 깔려도 묻히지 않도록 상세 화면의 사진 위 버튼과 같은 흰색으로 맞춘다
                <IconButton
                  aria-label="닫기"
                  color="semantic.static.white"
                  onClick={() => navigate(-1)}
                  size={24}
                  variant="normal"
                >
                  <IconClose />
                </IconButton>
              }
              variant="floating"
            />
          </div>
        }
        photos={photos.map((photo, index) => ({
          alt: `${title} 현장 사진 ${index + 1}`,
          src: photo,
        }))}
        showCounter
        /* Figma Image 375×463 — 화면 높이 안에서 세로 가운데에 둔다 */
        photoClassName="aspect-[375/463] w-full object-cover"
        slideClassName="flex h-full items-center"
        snapAlign="center"
        snapStop
      />
    </div>
  );
}

export default ArchivesPhotoViewerScreen;
