import { Switch, Typography } from "@wanteddev/wds";

interface NotificationToggleRowProps {
  title: string;
  /** 카테고리 알림에만 있는 설명 — 전체 알림 행은 제목만 쓴다 */
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

// Figma: 알림 설정(nodeId 3013:116182)의 Global Notification Row(3013:116188)와 Category
// Notification Row(3013:116194 등) — 설명 유무만 다르고 나머지(좌우 20px 패딩, 제목 Body2/Bold,
// 스위치)가 같아서 description optional 한 컴포넌트로 합쳤다.
// 스위치는 Figma `Switch/Switch`(679:16080, WDS 공식 문서 링크 확인)라 WDS `Switch`를 그대로 쓴다.
function NotificationToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: NotificationToggleRowProps) {
  return (
    <div className="flex items-center justify-between px-5">
      <div className="flex flex-col gap-0.5">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="body2"
          weight="bold"
        >
          {title}
        </Typography>
        {description && (
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {description}
          </Typography>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        size="small"
      />
    </div>
  );
}

export default NotificationToggleRow;
