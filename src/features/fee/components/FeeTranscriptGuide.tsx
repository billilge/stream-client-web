import { Typography } from "@wanteddev/wds";

import transcriptExample from "@/assets/images/fee/transcript-example.png";

// Figma: Transcript Preview Section (nodeId 3562:162857)
// 어떤 화면을 캡처해야 하는지 보여주는 예시 카드. 안쪽 이미지는 가려진 개인정보까지 포함해
// 디자인에서 그린 그림이라 Figma export를 그대로 쓴다(실제 사용자 데이터가 아니다).
function FeeTranscriptGuide() {
  return (
    // Figma 카드는 248px에서 잘린다 — 예시 이미지 아래쪽(이수학기 행)이 일부러 잘려 보인다
    <div className="flex h-[248px] flex-col items-center gap-[13px] overflow-hidden rounded-xl bg-background-alternative px-7 pt-4">
      <Typography
        as="p"
        className="w-full"
        color="semantic.label.alternative"
        variant="caption1"
        weight="medium"
      >
        캡처 예시
      </Typography>
      <img
        alt="학점이수현황 캡처 예시 — 학생정보와 이수학기가 보이는 화면"
        className="w-[280px]"
        src={transcriptExample}
      />
    </div>
  );
}

export default FeeTranscriptGuide;
