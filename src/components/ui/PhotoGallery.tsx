import { PageCounter } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";
import {
  type ReactNode,
  type UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import LazyImage from "@/components/ui/LazyImage";

export interface PhotoGalleryPhoto {
  src: string;
  alt: string;
}

interface PhotoGalleryBaseProps {
  idPrefix: string;
  // 슬라이드 뒤에 깔리는 배경(아카이빙 뷰어의 흐린 사진). 스크롤 영역 밖이라 같이 넘어가지 않는다.
  background?: ReactNode;
  // 뒤로가기 버튼처럼 이미지 위에 얹히는 오버레이(화면마다 위치·존재 여부가 다르다 — 예: 행사
  // 상세는 헤더 없이 이미지 위 오버레이 버튼, 공지 상세는 ScreenHeader를 따로 쓴다).
  overlay?: ReactNode;
  showCounter: boolean;
  slideClassName: string;
  /** photos를 줄 때 사진 자리(LazyImage 바깥 박스)에 줄 클래스 — 기본은 슬라이드를 꽉 채운다 */
  photoClassName?: string;
  /** 갤러리 루트에 덧붙일 클래스 — 전체 화면을 채우는 뷰어처럼 바깥 배치가 다른 경우에 쓴다 */
  className?: string;
  /** 처음 보여줄 장(1부터). 누른 사진에서 열리는 뷰어가 쓴다 */
  initialPage?: number;
  onPageChange?: (page: number) => void;
  /** 슬라이드 스냅 기준 — 기본은 start, 전체 화면 뷰어는 center */
  snapAlign?: "start" | "center";
  /** true면 세게 밀어도 여러 장을 건너뛰지 않고 다음 한 장에서 멈춘다(scroll-snap-stop: always) */
  snapStop?: boolean;
  /** 카운터 위치 — 기본은 오른쪽 아래 모서리 */
  counterClassName?: string;
  /** 어두운 사진 위에 올라가는 카운터(Figma Page Indicator/Counter의 Alternative=True) */
  counterAlternative?: boolean;
}

// 실 이미지 API가 붙은 화면은 photos로 실제 사진을, 아직 장수만 아는 화면은 photoCount로
// 회색 placeholder를 그린다.
type PhotoGalleryProps = PhotoGalleryBaseProps &
  (
    | { photos: PhotoGalleryPhoto[]; photoCount?: never }
    | { photoCount: number; photos?: never }
  );

const SNAP_ALIGN_CLASS_NAMES = {
  center: "snap-center",
  start: "snap-start",
} as const;

// 사진 여러 장을 가로 스크롤 스냅으로 넘기는 공용 갤러리 — 공지 상세·행사 상세·아카이빙 사진
// 뷰어가 공유한다. 웹(hover 가능 기기)에서는 화살표 버튼이 호버 시 뜨고, 모바일(터치)에서는
// 스와이프로만 넘긴다. Figma에는 없는 Stream 자체 인터랙션이라 화면 쪽 디자인이 아니라 여기서
// 새로 만들었다.
function PhotoGallery({
  idPrefix,
  background,
  overlay,
  photoCount,
  photos,
  showCounter,
  slideClassName,
  photoClassName = "size-full",
  className = "",
  initialPage = 1,
  onPageChange,
  snapAlign = "start",
  snapStop = false,
  counterClassName = "right-5 bottom-5",
  counterAlternative = false,
}: PhotoGalleryProps) {
  const totalPages = photos?.length ?? photoCount ?? 0;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const galleryRef = useRef<HTMLDivElement>(null);
  const hasMultiplePhotos = totalPages > 1;

  // 실 이미지 API 전까지는 장수만 알고 URL이 없어서, 슬라이드 key를 미리 만들어 둔다
  // (map 콜백의 index를 key로 쓰면 noArrayIndexKey에 걸린다). 실제 사진도 같은 파일이 여러 장
  // 올 수 있어서 URL이 아니라 순서로 구분한다.
  const photoKeys = useMemo(
    () =>
      Array.from(
        { length: totalPages },
        (_, index) => `${idPrefix}-photo-${index}`,
      ),
    [idPrefix, totalPages],
  );

  // 처음 열 때 initialPage 위치로 맞춰둔다. 이후 넘기는 건 사용자 스크롤이 담당한다.
  useEffect(() => {
    const el = galleryRef.current;
    if (el) {
      el.scrollLeft = (initialPage - 1) * el.offsetWidth;
    }
  }, [initialPage]);

  // 스크롤 위치로 현재 장을 역산한다.
  const handleGalleryScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, offsetWidth } = event.currentTarget;
    if (offsetWidth === 0) {
      return;
    }
    const page = Math.round(scrollLeft / offsetWidth) + 1;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // 화살표 클릭(웹 전용)은 프로그래밍적으로 한 장만큼 스크롤한다 — 스와이프와 같은 스냅 위치로 맞춰진다.
  const scrollToPage = (page: number) => {
    const el = galleryRef.current;
    if (!el || el.offsetWidth === 0) {
      return;
    }
    el.scrollTo({ behavior: "smooth", left: (page - 1) * el.offsetWidth });
  };

  const slideSnapClassName = `${SNAP_ALIGN_CLASS_NAMES[snapAlign]}${
    snapStop ? " snap-always" : ""
  }`;

  return (
    <div className={`group relative w-full shrink-0 ${className}`}>
      {background}

      {/* relative: background(absolute)가 배치된 요소라, 일반 흐름인 슬라이드보다 위에 그려진다.
          슬라이드 영역도 배치된 요소로 만들어서 DOM 순서대로 배경 위에 오게 한다. */}
      <div
        className="scrollbar-hidden relative flex h-full w-full snap-x snap-mandatory overflow-x-auto"
        onScroll={hasMultiplePhotos ? handleGalleryScroll : undefined}
        ref={galleryRef}
      >
        {photoKeys.map((photoKey, index) => {
          const photo = photos?.[index];
          return (
            <div
              className={[
                "w-full shrink-0",
                slideSnapClassName,
                // 실제 사진이 있으면 placeholder 배경은 깔지 않는다
                photo ? "" : "bg-thumbnail-placeholder",
                slideClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              key={photoKey}
            >
              {photo && (
                <LazyImage
                  alt={photo.alt}
                  className={photoClassName}
                  // 처음 보여줄 장은 바로 받는다(지연시키면 열자마자 빈 화면이 보인다).
                  // 나머지는 옆으로 넘겨 가까워질 때 받는다.
                  isEager={index + 1 === initialPage}
                  src={photo.src}
                />
              )}
            </div>
          );
        })}
      </div>

      {overlay}

      {/* group + 웹 전용(hover:hover) 미디어에서만 화살표를 보여준다 — 터치 기기는 hover 자체가
          없어서 항상 hidden으로 남고, 스와이프(스크롤 스냅)로만 넘긴다. */}
      {hasMultiplePhotos && (
        <>
          {currentPage > 1 && (
            <button
              aria-label="이전 사진"
              className="absolute top-1/2 left-4 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity focus-visible:opacity-100 [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100"
              onClick={() => scrollToPage(currentPage - 1)}
              type="button"
            >
              <IconChevronLeft className="size-5 text-white" />
            </button>
          )}
          {currentPage < totalPages && (
            <button
              aria-label="다음 사진"
              className="absolute top-1/2 right-4 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity focus-visible:opacity-100 [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100"
              onClick={() => scrollToPage(currentPage + 1)}
              type="button"
            >
              <IconChevronRight className="size-5 text-white" />
            </button>
          )}
        </>
      )}

      {showCounter && (
        <div
          className={`pointer-events-none absolute z-10 ${counterClassName}`}
        >
          <PageCounter
            alternative={counterAlternative}
            currentPage={currentPage}
            size="small"
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
