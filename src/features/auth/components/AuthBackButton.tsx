import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";

// 모든 단계의 헤더가 같은 뒤로가기 버튼을 쓴다
function AuthBackButton({ onClick }: { onClick: () => void }) {
  return (
    <TopNavigationButton aria-label="뒤로가기" onClick={onClick} variant="icon">
      <IconChevronLeft />
    </TopNavigationButton>
  );
}

export default AuthBackButton;
