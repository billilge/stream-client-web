import { Typography } from "@wanteddev/wds";

import transcriptExample from "@/assets/images/fee/transcript-example.png";

// Figma: Transcript Preview Section (nodeId 3562:162857)
// 어떤 화면을 캡처해야 하는지 보여주는 예시 카드.
//
// 안쪽 그림(3562:162858)은 Figma에서 실제 K-스마트멘토 스크린샷 위에 가림 박스 9개와 가짜 값
// (소프트웨어전공 / 20260000 / 홍길동 등)을 얹어 만든 것이다. 그래서 레이어별로 쪼개진
// `svgAssets`나 원본 `rawImages`를 쓰면 안 되고, 가림까지 합쳐진 `export` PNG만 커밋한다 —
// 커밋 전에 가림 박스가 전부 불투명한지(밑글씨가 비치지 않는지) 픽셀로 확인했다.
// 3배 크기(840x615)로 받아서 고해상도 화면에서도 또렷하게 보이게 한다.
function FeeTranscriptGuide() {
  return (
    // Figma 카드는 248px에서 잘린다 — 예시 이미지 아래쪽(이수학기 행)이 일부러 잘려 보인다
    // 335px 카드 안에 280px 그림을 가운데 두면 좌우가 27.5px씩 남는다(Figma는 28/27로 반올림)
    <div className="flex h-[248px] flex-col items-center gap-[13px] overflow-hidden rounded-xl bg-background-alternative px-[27.5px] pt-4">
      <Typography
        as="p"
        className="w-full"
        color="semantic.label.alternative"
        variant="caption2"
        weight="regular"
      >
        캡처 예시
      </Typography>
      <img
        alt="학점이수현황 캡처 예시 — 학생정보와 이수학기가 보이는 화면"
        className="w-full shrink-0"
        height={615}
        src={transcriptExample}
        width={840}
      />
    </div>
  );
}

export default FeeTranscriptGuide;
