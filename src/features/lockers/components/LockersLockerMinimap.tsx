import type { ReactNode } from "react";

export interface LockersLockerMinimapViewport {
  /** 스크롤 영역 전체 폭 대비 보이는 영역의 시작 위치(0~1) */
  start: number;
  /** 스크롤 영역 전체 폭 대비 보이는 영역의 폭(0~1) */
  size: number;
}

interface LockersLockerMinimapProps {
  /** 본문과 같은 칸 배치를 그대로 넘긴다 — 축소해서 그린다 */
  children: ReactNode;
  viewport: LockersLockerMinimapViewport;
}

// Figma 미니맵(2159:110757)은 본문 칸 배치(약 620px 폭)를 약 192px로 줄여 그렸다.
const MINIMAP_ZOOM = 0.31;

// Figma: Minimap (nodeId 2159:110757) — Stream 로컬. 좌우로 스크롤되는 칸 배치의 전체 모습과
// 지금 보이는 자리(검은 테두리, Figma "Highlight Overlay")를 보여준다.
//
// Figma는 칸·글자 크기를 하나하나 줄여서(칸 8px·글자 4px) 따로 그렸지만, 여기서는 본문 배치를
// `zoom`으로 줄여서 그린다. 칸 배치가 바뀌어도 미니맵을 따로 고칠 필요가 없고, 테두리 위치를
// 스크롤 비율에 그대로 맞출 수 있다. 4px 글자를 직접 쓰면 브라우저 최소 글자 크기에 걸리는 것도 피한다.
//
// 테두리는 Figma처럼 미니맵보다 위아래로 크다(미니맵 110px · 테두리 128px, 미니맵이 10px 아래에서 시작).
function LockersLockerMinimap({
  children,
  viewport,
}: LockersLockerMinimapProps) {
  return (
    <div aria-hidden className="relative h-32 shrink-0">
      <div className="mt-2.5 h-[110px] overflow-hidden rounded-lg bg-cool-neutral-97 p-2">
        {/* 축소본 안의 칸 버튼이 Tab·스크린리더에 두 번 잡히지 않게 막는다 */}
        <div inert style={{ zoom: MINIMAP_ZOOM }}>
          {children}
        </div>
      </div>
      <div
        className="absolute top-0 h-32 rounded-[2px] border border-label-strong"
        style={{
          left: `${viewport.start * 100}%`,
          width: `${viewport.size * 100}%`,
        }}
      />
    </div>
  );
}

export default LockersLockerMinimap;
