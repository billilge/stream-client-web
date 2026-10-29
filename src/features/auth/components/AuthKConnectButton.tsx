import { Typography } from "@wanteddev/wds";

import kConnectLogo from "@/assets/icons/auth/k-connect-logo.svg";

interface AuthKConnectButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

// Figma: 로그인 Action Area > K-CONNECT 버튼 (nodeId 3147:135414) — Stream 로컬 버튼이다.
// K-CONNECT 브랜드색(#004F9F)이라 WDS ActionAreaButton의 primary 색으로는 만들 수 없고, 모서리 12px·
// 높이 57px(위아래 18px + 줄 높이 24px 안에 로고 28px)도 WDS 버튼 크기 스케일에 없다.
function AuthKConnectButton({ isLoading, onClick }: AuthKConnectButtonProps) {
  return (
    <button
      aria-busy={isLoading}
      className="flex h-14.25 w-full items-center justify-center gap-2 rounded-xl bg-k-connect px-6 py-4.5 disabled:opacity-70"
      disabled={isLoading}
      onClick={onClick}
      type="button"
    >
      <span className="flex size-7 shrink-0 items-center justify-center">
        <img alt="" src={kConnectLogo} />
      </span>
      <Typography color="semantic.static.white" variant="body1" weight="bold">
        K-CONNECT로 시작하기
      </Typography>
    </button>
  );
}

export default AuthKConnectButton;
