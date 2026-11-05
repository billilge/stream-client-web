import { Button, Typography } from "@wanteddev/wds";
import { useId } from "react";

export type NotificationsAdminAction = "reject" | "approve" | "complete";

interface NotificationsAdminItemProps {
  icon: string;
  label: string;
  title: string;
  /** 받으러 오는 시각 같은 보조 정보 — 없으면 줄을 그리지 않는다 */
  body: string | null;
  timeLabel: string;
  isRead: boolean;
  /** 처리 버튼 — 없으면(학생이 신청을 취소한 알림) 사용자 알림처럼 행 전체를 눌러 읽는다 */
  action: {
    /** 승인 전(review)엔 반려·승인, 승인 뒤(handover)엔 대여·반납 완료 버튼을 둔다 */
    step: "review" | "handover";
    completeLabel: string;
    /** 서버에 보내는 중인 버튼 — 그 버튼은 로딩으로, 나머지는 막아 둔다 */
    pendingAction: NotificationsAdminAction | null;
    onAction: (action: NotificationsAdminAction) => void;
  } | null;
  onRead: () => void;
}

// 관리자 알림 항목 — Figma 시안이 없어 사용자 알림 항목(NotificationsItem, 3595:107106)의 아이콘·라벨·시간 줄과
// 안 읽은 배경을 그대로 따르고, 문구 오른쪽에 WDS Button(small)으로 처리 버튼을 붙였다.
// 버튼이 있는 항목은 행 전체를 버튼으로 둘 수 없어서(버튼 안 버튼) div로 그리고, 버튼이 없는 취소 알림만
// 사용자 알림처럼 행 전체를 눌러 읽는다.
function NotificationsAdminItem({
  icon,
  label,
  title,
  body,
  timeLabel,
  isRead,
  action,
  onRead,
}: NotificationsAdminItemProps) {
  // 스크린리더가 "승인"만 읽지 않고 어느 신청의 버튼인지 같이 읽게 한다
  const titleId = useId();

  const className = `flex w-full flex-col px-5 py-4 text-left ${
    isRead ? "" : "bg-notification-unread"
  }`;

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img alt="" className="size-6 shrink-0" src={icon} />
        <Typography
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          {label}
        </Typography>
      </div>
      <Typography
        color="semantic.label.alternative"
        variant="caption2"
        weight="regular"
      >
        {timeLabel}
      </Typography>
    </div>
  );

  // 버튼 때문에 문구 폭이 좁아서 "신청\n했어요"처럼 단어 중간에서 줄이 바뀌지 않게 단어 단위로 줄을 바꾼다
  const message = (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 break-keep">
      <Typography
        color="semantic.label.normal"
        id={titleId}
        variant="label1-reading"
        weight="medium"
      >
        {!isRead && <span className="sr-only">안 읽은 알림. </span>}
        {title}
      </Typography>
      {body !== null && (
        <Typography
          color="semantic.label.alternative"
          variant="label2"
          weight="regular"
        >
          {body}
        </Typography>
      )}
    </div>
  );

  if (action === null) {
    return (
      <button className={className} onClick={onRead} type="button">
        {header}
        {/* 아이콘(24) + 간격(8) 만큼 들여 라벨과 같은 줄에서 시작하고, 오른쪽은 38px(pr-9.5) 비운다 */}
        <div className="flex pr-9.5 pl-8">{message}</div>
      </button>
    );
  }

  const { step, completeLabel, pendingAction, onAction } = action;
  const isPending = pendingAction !== null;

  return (
    <div className={className}>
      {header}
      <div className="flex items-center gap-3 pl-8">
        {message}
        <div className="flex shrink-0 gap-1.5">
          {step === "handover" ? (
            <Button
              aria-describedby={titleId}
              color="primary"
              disabled={isPending && pendingAction !== "complete"}
              loading={pendingAction === "complete"}
              onClick={() => onAction("complete")}
              size="small"
              variant="solid"
            >
              {completeLabel}
            </Button>
          ) : (
            <>
              <Button
                aria-describedby={titleId}
                color="assistive"
                disabled={isPending && pendingAction !== "reject"}
                loading={pendingAction === "reject"}
                onClick={() => onAction("reject")}
                size="small"
                variant="outlined"
              >
                반려
              </Button>
              <Button
                aria-describedby={titleId}
                color="primary"
                disabled={isPending && pendingAction !== "approve"}
                loading={pendingAction === "approve"}
                onClick={() => onAction("approve")}
                size="small"
                variant="solid"
              >
                승인
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsAdminItem;
