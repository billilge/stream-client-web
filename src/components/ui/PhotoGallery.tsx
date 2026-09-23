import { PageCounter } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";
import { type ReactNode, type UIEvent, useMemo, useRef, useState } from "react";

interface PhotoGalleryProps {
  idPrefix: string;
  // 뒤로가기 버튼처럼 이미지 위에 얹히는 오버레이(화면마다 위치·존재 여부가 다르다 — 예: 행사
  // 상세는 헤더 없이 이미지 위 오버레이 버튼, 공지 상세는 ScreenHeader를 따로 쓴다).
  overlay?: ReactNode;
  photoCount: number;
  showCounter: boolean;
  slideClassName: string;
}

// 사진 여러 장을 가로 스크롤 스냅으로 넘기는 공용 갤러리 — 공지 상세·행사 상세가 공유한다.
// 웹(hover 가능 기기)에서는 화살표 버튼이 호버 시 뜨고, 모바일(터치)에서는 스와이프로만
// 넘긴다. Figma에는 없는 Stream 자체 인터랙션이라 화면 쪽 디자인이 아니라 여기서 새로 만들었다.
function PhotoGallery({
  idPrefix,
  overlay,
  photoCount,
  showCounter,
  slideClassName,
}: PhotoGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const galleryRef = useRef<HTMLDivElement>(null);
  const hasMultiplePhotos = photoCount > 1;

  // 실 이미지 API 전까지는 장수만 알고 URL이 없어서, 슬라이드 key를 미리 만들어 둔다
  // (map 콜백의 index를 key로 쓰면 noArrayIndexKey에 걸린다).
  const photoKeys = useMemo(
    () =>
      Array.from(
        { length: photoCount },
        (_, index) => `${idPrefix}-photo-${index}`,
      ),
    [idPrefix, photoCount],
  );

  // 스크롤 위치로 현재 장을 역산한다.
  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, offsetWidth } = event.currentTarget;
    if (offsetWidth === 0) {
      return;
    }
    setCurrentPage(Math.round(scrollLeft / offsetWidth) + 1);
  };

  // 화살표 클릭(웹 전용)은 프로그래밍적으로 한 장만큼 스크롤한다 — 스와이프와 같은 스냅 위치로 맞춰진다.
  const scrollToPage = (page: number) => {
    const el = galleryRef.current;
    if (!el || el.offsetWidth === 0) {
      return;
    }
    el.scrollTo({ behavior: "smooth", left: (page - 1) * el.offsetWidth });
  };

  return (
    <div className="group relative w-full shrink-0">
      <div
        className={`scrollbar-hidden flex w-full snap-x snap-mandatory overflow-x-auto ${slideClassName}`}
        onScroll={hasMultiplePhotos ? handleGalleryScroll : undefined}
        ref={galleryRef}
      >
        {photoKeys.map((photoKey) => (
          <div
            className={`w-full shrink-0 snap-start bg-thumbnail-placeholder ${slideClassName}`}
            key={photoKey}
          />
        ))}
      </div>

      {overlay}

      {/* group + 웹 전용(hover:hover) 미디어에서만 화살표를 보여준다 — 터치 기기는 hover 자체가
          없어서 항상 hidden으로 남고, 스와이프(스크롤 스냅)로만 넘긴다. */}
      {hasMultiplePhotos && (
        <>
          {currentPage > 1 && (
            <button
              aria-label="이전 사진"
              className="absolute top-1/2 left-4 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100"
              onClick={() => scrollToPage(currentPage - 1)}
              type="button"
            >
              <IconChevronLeft className="size-5 text-white" />
            </button>
          )}
          {currentPage < photoCount && (
            <button
              aria-label="다음 사진"
              className="absolute top-1/2 right-4 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100"
              onClick={() => scrollToPage(currentPage + 1)}
              type="button"
            >
              <IconChevronRight className="size-5 text-white" />
            </button>
          )}
        </>
      )}

      {showCounter && (
        <div className="pointer-events-none absolute right-5 bottom-5 z-10">
          <PageCounter
            currentPage={currentPage}
            size="small"
            totalPages={photoCount}
          />
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
