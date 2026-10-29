import { ActionArea, ActionAreaButton } from "@wanteddev/wds";

// 하단 고정 버튼 영역 — WDS ActionAreaButton은 세로 padding 12px(48px)인데 Figma Main Action은 16px(56px)이라 맞춘다.
// ActionArea 아래 padding 20px + 14px = Figma Bottom Safe Area 34px(앱 WebView에서는 네이티브 세이프에어리어와
// 겹쳐서 데스크톱 프레임에서만 남긴다).
function AuthBottomAction({
  label,
  disabled = false,
  onClick,
  hasBackground = false,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  hasBackground?: boolean;
}) {
  return (
    <div className="shrink-0">
      <ActionArea background={hasBackground}>
        <ActionAreaButton
          disabled={disabled}
          onClick={onClick}
          sx={{ paddingBlock: "16px" }}
        >
          {label}
        </ActionAreaButton>
      </ActionArea>
      <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
    </div>
  );
}

export default AuthBottomAction;
