import { useLayoutEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  /** 바깥 박스(= 사진이 들어갈 자리)에 줄 클래스. 크기·위치는 여기서 정한다 */
  className?: string;
}

// 사진이 도착하기 전에는 회색 자리(Figma의 이미지 슬롯과 같은 thumbnail-placeholder)를 보여주고,
// 도착하면 페이드인한다. 자리 크기는 바깥 박스가 들고 있어서 사진이 늦게 와도 레이아웃이 밀리지 않는다.
// 사진은 자리를 꽉 채우고 넘치는 부분은 잘린다(object-cover) — 카드·썸네일처럼 자리 비율이 정해진 곳에 쓴다.
// 받는 시점은 브라우저 기본 지연 로딩(loading="lazy")에 맡긴다 — IntersectionObserver를 직접 두면
// 같은 일을 두 번 하게 되고, 스크롤 컨테이너가 중첩된 이 앱에서 기준을 또 관리해야 한다.
// 받기에 실패한 사진은 회색 자리로 남긴다(깨진 이미지 아이콘을 보이지 않는다).
function LazyImage({ src, alt, className = "" }: LazyImageProps) {
  // 불리언 대신 "다 받은 주소"를 들고 있어서, src가 바뀌면 따로 초기화하지 않아도 회색 자리부터 다시 시작한다.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;
  const imageRef = useRef<HTMLImageElement>(null);

  // 캐시에 있는 사진은 React가 onLoad를 붙이기 전에 이미 완료돼서 이벤트가 안 온다 — 그려지기 전에 직접 확인한다.
  // useEffect면 투명한 상태가 한 번 그려진 뒤라, 캐시된 사진도 다시 들어올 때마다 페이드인이 돈다.
  // complete는 받기에 실패해도 true라서, 실제로 그림이 있는지(naturalWidth)까지 본다.
  useLayoutEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src]);

  return (
    <span
      className={`block overflow-hidden ${
        isLoaded ? "" : "bg-thumbnail-placeholder"
      } ${className}`}
    >
      <img
        alt={alt}
        className={`size-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        decoding="async"
        loading="lazy"
        onLoad={() => setLoadedSrc(src)}
        ref={imageRef}
        src={src}
      />
    </span>
  );
}

export default LazyImage;
