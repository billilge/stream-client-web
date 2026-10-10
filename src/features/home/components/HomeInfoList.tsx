import { ContentBadge, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import arrowRight from "@/assets/icons/home/arrow-right.svg";
import arrowUpRight from "@/assets/icons/home/arrow-up-right.svg";
import infoFee from "@/assets/icons/home/info-fee.svg";
import infoFeedback from "@/assets/icons/home/info-feedback.svg";
import infoLocker from "@/assets/icons/home/info-locker.svg";
import type {
  HomeFeeStatus,
  HomeLockerStatus,
  HomeMyInfo,
} from "@/features/home/constants/homeMock";

type BadgeColor = "orange" | "red" | "green";

interface InfoBadge {
  label: string;
  // 없으면 neutral(회색) 배지
  color?: BadgeColor;
}

// Figma: 학생회비 납부 여부 뱃지 (nodeId 3147:146475). 미납은 배지 대신 납부 안내 줄로 바뀐다.
const FEE_BADGES: Record<Exclude<HomeFeeStatus, "unpaid">, InfoBadge> = {
  checking: { color: "orange", label: "납부확인중" },
  "needs-check": { color: "red", label: "확인필요" },
  paid: { color: "green", label: "납부완료" },
};

// Figma: 사물함 배정 상태 뱃지 (nodeId 3147:146479)
const LOCKER_BADGES: Record<HomeLockerStatus, InfoBadge> = {
  assigned: { color: "green", label: "배정완료" },
  expired: { color: "red", label: "기간종료" },
  none: { label: "미신청" },
};

function InfoBadgeView({ badge }: { badge: InfoBadge }) {
  return (
    <ContentBadge
      accentColor={
        badge.color ? `semantic.accent.foreground.${badge.color}` : undefined
      }
      color={badge.color ? "accent" : "neutral"}
      neutralColor={badge.color ? undefined : "semantic.label.alternative"}
      size="small"
      variant="solid"
    >
      {badge.label}
    </ContentBadge>
  );
}

interface InfoRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: InfoBadge;
  // 학생회비 납부하기는 앱 밖(송금)으로 나가서 ↗ 화살표다
  isExternal?: boolean;
  // 없으면 누를 수 없는 줄로 그린다(아직 화면이 없는 학생회비 납부하기)
  onSelect?: () => void;
}

function InfoRow({
  icon,
  title,
  subtitle,
  badge,
  isExternal,
  onSelect,
}: InfoRowProps) {
  let trailing: ReactNode = (
    <img
      alt=""
      className="size-3"
      src={isExternal ? arrowUpRight : arrowRight}
    />
  );
  if (badge) {
    trailing = (
      <>
        <InfoBadgeView badge={badge} />
        {trailing}
      </>
    );
  }

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <img alt="" className="size-10.5 shrink-0" src={icon} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="caption1"
              weight="regular"
            >
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{trailing}</div>
    </>
  );

  return onSelect ? (
    <button
      className="flex items-center justify-between gap-3 text-left"
      onClick={onSelect}
      type="button"
    >
      {content}
    </button>
  ) : (
    <div className="flex items-center justify-between gap-3">{content}</div>
  );
}

// Figma: Home Info List (nodeId 3147:146284). 순서는 학생회비 → 열린피드백 → 사물함으로 고정한다.
interface HomeInfoListProps {
  myInfo: HomeMyInfo;
  onSelectFee: () => void;
  onSelectFeedbacks: () => void;
  onSelectLocker: () => void;
}

function HomeInfoList({
  myInfo,
  onSelectFee,
  onSelectFeedbacks,
  onSelectLocker,
}: HomeInfoListProps) {
  const { feeStatus, feedbackCount, lockerStatus, lockerLabel } = myInfo;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
      {feeStatus === "unpaid" ? (
        // TODO: 학생회비 계좌 송금 화면(#105)이 머지되면 onSelect로 연결한다
        <InfoRow
          icon={infoFee}
          isExternal
          subtitle="계좌 입력 없이 바로 이체할 수 있어요"
          title="학생회비 납부하기"
        />
      ) : (
        <InfoRow
          badge={FEE_BADGES[feeStatus]}
          icon={infoFee}
          onSelect={onSelectFee}
          title="학생회비 납부 여부"
        />
      )}
      <InfoRow
        icon={infoFeedback}
        onSelect={onSelectFeedbacks}
        subtitle={feedbackCount > 0 ? `${feedbackCount}건` : "-"}
        title="열린피드백 작성내역"
      />
      <InfoRow
        badge={LOCKER_BADGES[lockerStatus]}
        icon={infoLocker}
        onSelect={onSelectLocker}
        subtitle={lockerStatus === "assigned" ? lockerLabel : undefined}
        title="사물함 배정 상태"
      />
    </div>
  );
}

export default HomeInfoList;
