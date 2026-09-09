import { TopNavigation, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";

interface ScreenHeaderProps {
  title: string;
}

// Figma: Top Navigation/Resource/Contents의 타이틀 + 검색/알림 아이콘 부분 — 행사·빌릴게 등
// 여러 화면에서 완전히 동일하게 반복되는 진짜 공통 패턴이라 재사용 컴포넌트로 뺐다.
// "Tool" 슬롯(세그먼트 토글 등)은 화면마다 값·동작이 달라서(대여/반납 vs 행사/신청내역)
// 여기 포함하지 않고 각 화면이 자기 본문에서 직접 그린다.
// background 기본값(true)은 iOS 반투명 스타일이라 뒤 배경이 비쳐 보인다. Figma는 별도 배경 없이
// 화면 배경을 그대로 쓴다.
function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <TopNavigation
      background={false}
      trailingContent={
        <>
          <TopNavigationButton aria-label="검색" variant="icon">
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <IconBell />
          </TopNavigationButton>
        </>
      }
      variant="display"
    >
      {title}
    </TopNavigation>
  );
}

export default ScreenHeader;
