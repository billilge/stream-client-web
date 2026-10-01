import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  /** 바깥 박스(= 사진이 들어갈 자리)에 줄 클래스. 크기·위치는 여기서 정한다 */
  className?: string;
  /** 열자마자 보이는 자리라 지연 없이 바로 받아야 할 때 */
  isEager?: boolean;
}

// 사진이 도착하기 전에는 회색 자리(Figma의 이미지 슬롯과 같은 thumbnail-placeholder)를 보여주고,
// 도착하면 페이드인한다. 자리 크기는 바깥 박스가 들고 있어서 사진이 늦게 와도 레이아웃이 밀리지 않는다.
// 받는 시점은 브라우저 기본 지연 로딩(loading="lazy")에 맡긴다 — IntersectionObserver를 직접 두면
// 같은 일을 두 번 하게 되고, 스크롤 컨테이너가 중첩된 이 앱에서 기준을 또 관리해야 한다.
function LazyImage({
  src,
  alt,
  className = "",
  isEager = false,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 캐시에 있는 사진은 React가 onLoad를 붙이기 전에 이미 완료돼서 이벤트가 안 온다.
  // 마운트 시점에 complete를 한 번 확인해서 회색 자리에 멈춰 있지 않게 한다.
  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <span
      className={`block overflow-hidden bg-thumbnail-placeholder ${className}`}
    >
      <img
        alt={alt}
        className={`size-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        decoding="async"
        loading={isEager ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        ref={imageRef}
        src={src}
      />
    </span>
  );
}

export default LazyImage;
