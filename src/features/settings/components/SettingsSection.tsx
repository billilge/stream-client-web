import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

interface SettingsSectionProps {
  /** 섹션 라벨("계정 정보"·"서비스 정보") — 알림 설정·로그아웃 카드처럼 없는 섹션도 있다 */
  title?: string;
  /** Figma 기준 행 사이 간격: 계정 정보·서비스 정보는 20px, 로그아웃은 16px */
  rowGap?: "default" | "compact";
  children: ReactNode;
}

// Figma: 설정 화면(nodeId 3013:116135)의 흰 카드 — Account Section(3013:116141),
// Notification Settings Section(3013:116158), Service Info Section(3013:116162),
// Logout Section(3013:116177) 넷이 같은 배경·radius·padding이라 하나로 합쳤다.
// 섹션 라벨 유무와 행 간격만 다르다.
function SettingsSection({
  title,
  rowGap = "default",
  children,
}: SettingsSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
      {title && (
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          {title}
        </Typography>
      )}
      <div
        className={`flex flex-col ${rowGap === "compact" ? "gap-4" : "gap-5"}`}
      >
        {children}
      </div>
    </section>
  );
}

export default SettingsSection;
