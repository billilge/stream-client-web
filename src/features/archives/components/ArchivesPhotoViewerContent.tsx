import { IconButton, Typography } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { use, useState } from "react";

import PhotoGallery from "@/components/ui/PhotoGallery";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { fetchArchive } from "@/entities/archives/archivesApi";

interface ArchivesPhotoViewerContentProps {
  archiveId: string;
  photoIndex: string;
  onClose: () => void;
}

// Figma: 현장 사진 하나 클릭 시 (nodeId 1526:171364)
// 넘기기·카운터는 공지/행사 상세와 같은 공용 PhotoGallery를 쓰고, 이 화면만의 흐린 배경과
// 닫기 버튼을 background/overlay 슬롯으로 넘긴다. 세게 밀어도 한 장만 넘어가도록 snapStop을 켠다.
// 사진 데이터를 받는 동안은 ArchivesPhotoViewerScreen의 Suspense가 빈 화면을 보여준다.
function ArchivesPhotoViewerContent({
  archiveId,
  photoIndex,
  onClose,
}: ArchivesPhotoViewerContentProps) {
  const archive = use(fetchArchive(archiveId));
  const photos = archive?.photos ?? [];

  // 주소의 photoIndex가 숫자가 아니거나 범위를 벗어나면 첫 장/마지막 장으로 맞춘다
  const initialIndex = Math.min(
    Math.max(Number(photoIndex) || 0, 0),
    Math.max(photos.length - 1, 0),
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!archive || photos.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          존재하지 않는 아카이빙이에요
        </Typography>
      </div>
    );
  }

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
                  onClick={onClose}
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
          alt: `${archive.title} 현장 사진 ${index + 1}`,
          src: photo,
        }))}
        showCounter
        /* 가로는 화면을 꽉 채우고 세로는 사진 비율대로 둔다 — 자리를 375×463으로 고정하면
           비율이 다른 사진에 좌우 여백이 생긴다. 아주 긴 사진만 max-h-full로 화면 안에 맞춘다. */
        photoClassName="max-h-full w-full object-contain"
        slideClassName="flex h-full items-center"
        snapAlign="center"
        snapStop
      />
    </div>
  );
}

export default ArchivesPhotoViewerContent;
