import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";

import BottomSheet from "@/components/ui/BottomSheet";
import { LOCKERS_NOTICE_ITEMS } from "@/features/lockers/constants/lockersNotice";

interface LockersNoticeSheetProps {
  open: boolean;
  /** 지금이 사물함 신청 기간인지. 아니면 하단 버튼이 잠기고 문구가 바뀐다. */
  isApplyPeriod: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Figma: 사물함 신청 전 유의사항 Sheet Body (nodeId 1737:218310)
//
// 신청 기간이 아닐 때의 모습은 Figma에 없다 — 유의사항 3줄은 그대로 두고 하단 버튼만 잠가
// "신청 기간이 아니에요"를 보여주기로 정했다(docs/plans/#68-lockers-notice-sheet.md 참고).
function LockersNoticeSheet({
  open,
  isApplyPeriod,
  onClose,
  onConfirm,
}: LockersNoticeSheetProps) {
  return (
    <BottomSheet contentGap={12} onClose={onClose} open={open}>
      {/* pb-7: Figma Sheet Body의 Notice Section ↔ Action Area 간격(28px).
          BottomSheet는 자식 사이에 간격을 두지 않아서 여기서 낸다. */}
      <div className="flex flex-col gap-6 px-5 pb-7">
        <Typography
          as="h2"
          color="semantic.label.strong"
          variant="heading2"
          weight="bold"
        >
          {/* Figma가 두 줄로 끊어둔 자리라 줄바꿈을 폭에 맡기지 않고 그대로 옮긴다 */}
          신청 전 아래 내용을
          <br />
          확인해 주세요
        </Typography>

        <div className="flex flex-col gap-6">
          {LOCKERS_NOTICE_ITEMS.map((item) => (
            <div className="flex items-center gap-3" key={item.label}>
              <img alt="" className="size-[42px] shrink-0" src={item.icon} />
              <div className="flex flex-col">
                <Typography
                  as="p"
                  color="semantic.label.alternative"
                  variant="label1"
                  weight="regular"
                >
                  {item.label}
                </Typography>
                <Typography
                  as="p"
                  color="semantic.label.normal"
                  variant="body2"
                  weight="medium"
                >
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActionArea>
        {/* Figma Main Action은 56px인데 ActionAreaButton은 48px이다. 높이를 고정하면 비활성
            문구가 길어져 줄바꿈될 때 잘려서 padding으로 맞춘다(wds-component-usage.md 참고). */}
        <ActionAreaButton
          disabled={!isApplyPeriod}
          onClick={onConfirm}
          sx={{ paddingBlock: "16px" }}
        >
          {isApplyPeriod ? "신청하기" : "신청 기간이 아니에요"}
        </ActionAreaButton>
      </ActionArea>
    </BottomSheet>
  );
}

export default LockersNoticeSheet;
