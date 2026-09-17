import { PageCounter, TopNavigationButton } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { ARCHIVES_DETAIL } from "@/features/archives/constants/archivesDetail";

// Figma: 현장 사진 하나 클릭 시 (nodeId 1526:171364)
// 가로 scroll-snap으로 한 장씩 넘긴다 — 터치 스와이프·트랙패드는 브라우저 기본 동작으로 처리된다.
// 각 장에 snap-always(scroll-snap-stop: always)를 줘서 세게 밀어도 여러 장을 건너뛰지 않고 한 장에서 멈춘다.
// 사진 목록은 API 연동 전까지 archiveId와 무관하게 상세 화면과 같은 목업을 쓴다.
function ArchivesPhotoViewerScreen() {
  const navigate = useNavigate();
  const { photoIndex } = useParams();
  const { photos } = ARCHIVES_DETAIL;
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 주소의 photoIndex가 숫자가 아니거나 범위를 벗어나면 첫 장/마지막 장으로 맞춘다
  const initialIndex = Math.min(
    Math.max(Number(photoIndex) || 0, 0),
    photos.length - 1,
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 처음 열 때 누른 사진 위치로 스크롤해 둔다. 이후 넘기는 건 사용자 스크롤이 담당한다.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollLeft = initialIndex * scroller.clientWidth;
    }
  }, [initialIndex]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (scroller && scroller.clientWidth > 0) {
      setCurrentIndex(Math.round(scroller.scrollLeft / scroller.clientWidth));
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-background-normal">
      {/* Figma Background blur — 현재 사진을 크게 흐리게 깔아 위아래 빈 공간을 채운다 */}
      <img
        alt=""
        className="absolute top-1/2 left-1/2 h-[877px] w-[711px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover blur-[21.55px]"
        src={photos[currentIndex]}
      />

      <div
        className="scrollbar-hidden absolute inset-0 flex snap-x snap-mandatory overflow-x-auto"
        onScroll={handleScroll}
        ref={scrollerRef}
      >
        {photos.map((photo, index) => (
          <div
            className="flex w-full shrink-0 snap-center snap-always items-center"
            // biome-ignore lint/suspicious/noArrayIndexKey: 같은 사진이 여러 장일 수 있고, 사진 목록은 순서가 바뀌지 않는다
            key={index}
          >
            {/* Figma Image 375×463 */}
            <img
              alt=""
              className="aspect-[375/463] w-full object-cover"
              src={photo}
            />
          </div>
        ))}
      </div>

      <ScreenHeader
        trailing={
          <TopNavigationButton
            aria-label="닫기"
            onClick={() => navigate(-1)}
            variant="icon"
          >
            <IconClose />
          </TopNavigationButton>
        }
        variant="floating"
      />

      {/* Figma Page Indicator/Counter(Size=Small, Alternative=True) — 화면 하단에서 47px 위 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[47px] flex justify-center">
        <PageCounter
          alternative
          currentPage={currentIndex + 1}
          size="small"
          totalPages={photos.length}
        />
      </div>
    </div>
  );
}

export default ArchivesPhotoViewerScreen;
