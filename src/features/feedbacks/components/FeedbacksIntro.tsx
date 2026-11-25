import { Typography } from "@wanteddev/wds";
import type { RefObject } from "react";

import historyDocumentIcon from "@/assets/icons/feedbacks/history-button-document.svg";
import introDivider from "@/assets/icons/feedbacks/intro-divider.svg";
import writeBackgroundIcon from "@/assets/icons/feedbacks/write-button-bg.svg";
import writePencilIcon from "@/assets/icons/feedbacks/write-button-pencil.svg";

// 제목 글자에 깔리는 그라데이션 — Figma가 준 SVG radialGradient(어두운 남색 → 파랑)를 그대로 배경으로 쓴다.
// CSS radial-gradient로 옮기면 회전·늘림 행렬(gradientTransform)을 똑같이 맞출 수 없어서 원본을 쓴다.
const TITLE_GRADIENT = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 153 52' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.5 -5.15 20.985 10.187 72.5 60)'><stop stop-color='rgba(23,23,25,1)' offset='0'/><stop stop-color='rgba(20,29,45,1)' offset='0.125'/><stop stop-color='rgba(17,36,65,1)' offset='0.25'/><stop stop-color='rgba(12,49,106,1)' offset='0.5'/><stop stop-color='rgba(6,62,146,1)' offset='0.75'/><stop stop-color='rgba(0,75,187,1)' offset='1'/></radialGradient></defs></svg>")`;

interface FeedbacksIntroProps {
  /** '피드백 작성하기' 버튼 — 화면이 이 버튼이 화면 밖으로 나갔는지 보고 플로팅 버튼을 띄운다 */
  writeButtonRef: RefObject<HTMLButtonElement | null>;
  onWrite: () => void;
  onViewHistory: () => void;
}

// Figma: 열린피드백 개선 UI 1123 — 피드백 안내 영역 (nodeId 5421:95613)
// 열린피드백 메인 맨 위의 소개 문구와 두 버튼('피드백 작성하기' / '작성내역 보기').
// 버튼은 오른쪽에 반쯤 잘린 일러스트가 붙은 Stream 고유 버튼이라 WDS Button이 아니다.
// 일러스트는 Figma가 레이어별로 잘라 준 SVG를 원래 자리(51px 아이콘 칸 안의 비율 위치)에 겹쳐 놓는다.
function FeedbacksIntro({
  writeButtonRef,
  onWrite,
  onViewHistory,
}: FeedbacksIntroProps) {
  return (
    <section className="relative flex flex-col gap-7">
      {/* 문구 아래부터 버튼 아래까지 흰색 → Blue/99로 옅어지는 배경 (Figma 5421:95614, 위에서 19px·높이 147px) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-4.75 h-36.75 bg-linear-to-b from-white to-blue-99"
      />

      <div className="relative flex flex-col gap-4 px-5">
        <div className="flex flex-col gap-1">
          <Typography
            as="h2"
            className="whitespace-pre-line"
            sx={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: TITLE_GRADIENT,
              color: "transparent",
            }}
            variant="headline1"
            weight="bold"
          >
            {"더 나은 소융대를 위해\n의견을 들려 주세요"}
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            학생회가 확인하고 답해 드려요
          </Typography>
        </div>

        <div className="flex gap-2">
          <button
            className="relative flex flex-1 items-center overflow-hidden rounded-xl bg-blue-60 px-4 py-3.5 text-left"
            onClick={onWrite}
            ref={writeButtonRef}
            type="button"
          >
            <Typography
              className="relative"
              color="atomic.common.100"
              variant="label1"
              weight="bold"
            >
              피드백 작성하기
            </Typography>
            {/* 아이콘 칸 51px, 버튼 오른쪽 끝·위에서 7px (Figma I5421:95620;5201:36267). 칸 밖은 버튼이 잘라 낸다 */}
            <span aria-hidden className="absolute top-1.75 right-0 size-12.75">
              {/* 레이어 위치는 Figma 비율 inset 그대로다(동그란 배경 4.61%·3.57%·3.01%·4.71%, 연필 25%·23.81%·23.85%·25%) */}
              <img
                alt=""
                className="absolute top-[4.61%] left-[4.71%]"
                src={writeBackgroundIcon}
              />
              <img
                alt=""
                className="absolute top-1/4 left-1/4"
                src={writePencilIcon}
              />
            </span>
          </button>

          <button
            className="relative flex flex-1 items-center overflow-hidden rounded-xl border border-blue-60 bg-white px-4 py-3.5 text-left"
            onClick={onViewHistory}
            type="button"
          >
            <Typography
              className="relative"
              color="atomic.blue.55"
              variant="label1"
              weight="bold"
            >
              작성내역 보기
            </Typography>
            {/* 아이콘 칸 51px, 버튼 오른쪽 끝에서 1.5px·위에서 6px (Figma I5421:95621;5201:36292) */}
            <span aria-hidden className="absolute top-1.5 right-0.5 size-12.75">
              {/* 문서 레이어 inset 3.81%·4.48% (Figma 그대로) */}
              <img
                alt=""
                className="absolute top-[3.81%] left-[4.48%]"
                src={historyDocumentIcon}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 소개와 피드백 목록 사이 그라데이션 구분선 (Figma 5421:95622, 2px) */}
      <img alt="" className="block h-0.5 w-full" src={introDivider} />
    </section>
  );
}

export default FeedbacksIntro;
