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
    // 카드 높이를 고정하지 않는다 — 화면 프레임이 w-full / sm:w-[480px]라 카드 폭이 변하는데,
    // 248px(375 기준)로 박으면 넓은 화면에서 그림 아래가 잘린다. 아래 여백 없이 그림이 카드
    // 바닥에 붙는 Figma 구조(3562:162857: 위 16px, 내용 231.76px, 합 248px) 그대로 내용이
    // 높이를 정하게 두면 설계 폭에서 자동으로 248px이 된다. 모서리 때문에 overflow만 숨긴다.
    <div className="flex flex-col items-center gap-[13px] overflow-hidden rounded-xl bg-background-alternative px-7 pt-4">
      <Typography
        as="p"
        className="w-full"
        color="semantic.label.alternative"
        variant="caption2"
        weight="regular"
      >
        캡처 예시
      </Typography>
      {/* Figma 그림 크기는 280px 고정이다. 카드가 그보다 좁아지면 Tailwind preflight의
          max-width:100%가 알아서 줄여준다 — 넓어져도 커지지는 않게 w-full을 쓰지 않는다. */}
      <img
        alt="학점이수현황 캡처 예시 — 학생정보와 이수학기가 보이는 화면"
        className="w-[280px] shrink-0"
        height={615}
        src={transcriptExample}
        width={840}
      />
    </div>
  );
}

export default FeeTranscriptGuide;
