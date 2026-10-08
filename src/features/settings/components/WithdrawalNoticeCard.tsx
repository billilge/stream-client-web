import { Typography } from "@wanteddev/wds";

interface WithdrawalNoticeCardProps {
  title: string;
  description: string;
}

// Figma: 탈퇴 확인 페이지의 Withdrawal Notice Card (메인 컴포넌트 nodeId 3491:151566
// "Delete Accoount Card"). 네 장이 모두 같은 컴포넌트의 인스턴스고 문구만 다르다.
// 회색 카드(Background/Normal/Alternative)라 설정 화면의 흰 카드(SettingsSection)와는
// 배경이 반대다 — 같은 카드로 묶지 않고 따로 둔다.
function WithdrawalNoticeCard({
  title,
  description,
}: WithdrawalNoticeCardProps) {
  return (
    <li className="flex flex-col gap-1 rounded-xl bg-background-alternative p-4">
      <Typography
        as="p"
        color="semantic.label.normal"
        variant="body2"
        weight="bold"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="regular"
      >
        {description}
      </Typography>
    </li>
  );
}

export default WithdrawalNoticeCard;
