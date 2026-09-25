import { Button, Typography } from "@wanteddev/wds";
import { useState } from "react";

import LockersNoticeSheet from "@/features/lockers/components/LockersNoticeSheet";

// 임시 확인용 화면 — 시트를 띄울 진입점이 아직 없어서 둔 자리다.
// 실제 진입점(홈 "사물함 상태" 퀵링크 `1737:218284` 또는 공지 상세 CTA)이 붙으면
// 이 화면과 /lockers/apply 라우트는 지운다. docs/plans/#68-lockers-notice-sheet.md 참고.
function LockersApplyScreen() {
  const [openedPeriod, setOpenedPeriod] = useState<"apply" | "closed" | null>(
    null,
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
      <Typography as="p" color="semantic.label.alternative" variant="label1">
        사물함 유의사항 시트 확인용 임시 화면
      </Typography>
      <Button onClick={() => setOpenedPeriod("apply")}>
        신청 기간일 때 열기
      </Button>
      <Button
        color="assistive"
        onClick={() => setOpenedPeriod("closed")}
        variant="outlined"
      >
        신청 기간이 아닐 때 열기
      </Button>

      <LockersNoticeSheet
        isApplyPeriod={openedPeriod === "apply"}
        onClose={() => setOpenedPeriod(null)}
        // 확인 후 이동할 사물함 구역 선택 화면(1737:218452)은 다음 이슈라 지금은 닫기만 한다
        onConfirm={() => setOpenedPeriod(null)}
        open={openedPeriod !== null}
      />
    </div>
  );
}

export default LockersApplyScreen;
