import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";

interface ScreenHeaderProps {
  title: string;
}

// Figma: Top Navigation(nodeId 1765:71193)의 타이틀 + 검색/알림 아이콘 부분 — 행사·빌릴게 등
// 여러 화면에서 완전히 동일하게 반복되는 진짜 공통 패턴이라 재사용 컴포넌트로 뺐다.
// "Tool" 슬롯(세그먼트 토글 등)은 화면마다 값·동작이 달라서(대여/반납 vs 행사/신청내역)
// 여기 포함하지 않고 각 화면이 자기 본문에서 직접 그린다.
//
// 이 Top Navigation은 WDS Top Navigation/Resource/Contents가 아니라 Stream 로컬
// 컴포넌트다 — 세로 패딩 12px + Title 3/Bold(32px)로 총 56px인데, WDS display variant는
// 세로 패딩이 16px 고정이라 64px이 된다. 그래서 레이아웃만 직접 구현하고, 아이콘 버튼
// (TopNavigationButton)은 그대로 재사용한다.
function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between px-5 py-3">
      <Typography
        as="h2"
        color="semantic.label.strong"
        variant="title3"
        weight="bold"
      >
        {title}
      </Typography>
      <div className="flex shrink-0 items-center gap-4">
        <TopNavigationButton aria-label="검색" variant="icon">
          <IconSearch />
        </TopNavigationButton>
        <TopNavigationButton aria-label="알림" variant="icon">
          <IconBell />
        </TopNavigationButton>
      </div>
    </div>
  );
}

export default ScreenHeader;
