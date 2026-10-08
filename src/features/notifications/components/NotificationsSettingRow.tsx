import { Switch, Typography } from "@wanteddev/wds";

interface NotificationsSettingRowProps {
  label: string;
  /** 있으면 라벨 아래에 설명을 붙인다 — Figma "전체 알림" 행에는 설명이 없다 */
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

// Figma: Global Notification Row (nodeId 3628:110843) / Category Notification Row (3628:110849)
// 스위치는 WDS `Switch size="small"`(Figma Switch/Switch, 39×24)이다.
function NotificationsSettingRow({
  label,
  description,
  checked,
  onCheckedChange,
}: NotificationsSettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-5">
      <div className="flex min-w-0 flex-col gap-0.5">
        <Typography color="semantic.label.normal" variant="body2" weight="bold">
          {label}
        </Typography>
        {description !== undefined && (
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {description}
          </Typography>
        )}
      </div>
      <Switch
        aria-label={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        size="small"
      />
    </div>
  );
}

export default NotificationsSettingRow;
