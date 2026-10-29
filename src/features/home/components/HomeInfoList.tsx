import { ContentBadge, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import arrowRight from "@/assets/icons/common/arrow-right.svg";
import arrowUpRight from "@/assets/icons/home/arrow-up-right.svg";
import infoFee from "@/assets/icons/home/info-fee.svg";
import infoFeedback from "@/assets/icons/home/info-feedback.svg";
import infoLocker from "@/assets/icons/home/info-locker.svg";
import { FEE_STATUS_BADGES } from "@/features/fee/constants/fee";
import type { HomeMyInfo } from "@/features/home/constants/homeMock";
import { LOCKER_STATUS_BADGES } from "@/features/lockers/constants/lockers";

// 학생회비·사물함 배지는 각 기능의 배지 표(FEE_STATUS_BADGES·LOCKER_STATUS_BADGES)를 그대로 쓴다.
// 학생회비 미납은 배지 대신 납부 안내 줄로 바뀐다.
interface InfoBadge {
  label: string;
  // 없으면 neutral(회색) 배지
  color?: "orange" | "red" | "green";
}

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
  // 없으면 누를 수 없는 줄로 그린다
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
  /** 미납 상태의 "학생회비 납부하기" — 계좌 송금 플로우로 보낸다 */
  onSelectFeeTransfer: () => void;
  onSelectFeedbacks: () => void;
  onSelectLocker: () => void;
}

function HomeInfoList({
  myInfo,
  onSelectFee,
  onSelectFeeTransfer,
  onSelectFeedbacks,
  onSelectLocker,
}: HomeInfoListProps) {
  const { feeStatus, feedbackCount, lockerStatus, lockerLabel } = myInfo;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
      {feeStatus === "unpaid" ? (
        <InfoRow
          icon={infoFee}
          // 플로우 끝에서 토스(앱 밖)로 나가는 길이라 Figma가 ↗ 화살표를 쓴다
          isExternal
          onSelect={onSelectFeeTransfer}
          subtitle="계좌 입력 없이 바로 이체할 수 있어요"
          title="학생회비 납부하기"
        />
      ) : (
        <InfoRow
          badge={FEE_STATUS_BADGES[feeStatus]}
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
        badge={LOCKER_STATUS_BADGES[lockerStatus]}
        icon={infoLocker}
        onSelect={onSelectLocker}
        subtitle={lockerStatus === "assigned" ? lockerLabel : undefined}
        title="사물함 배정 상태"
      />
    </div>
  );
}

export default HomeInfoList;
