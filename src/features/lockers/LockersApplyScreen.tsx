import { useNavigate } from "react-router-dom";

import LockersNoticeSheet from "@/features/lockers/components/LockersNoticeSheet";
import { IS_LOCKERS_APPLY_PERIOD } from "@/features/lockers/constants/lockersNotice";

// Figma: 사물함 신청 전 유의사항 (nodeId 1737:218213)
// 신청 흐름의 첫 화면이다 — 들어오면 유의사항 시트부터 띄우고, 확인하면 구역 선택으로 보낸다.
// 시트를 닫으면(딤 탭) 들어온 곳으로 돌아간다.
//
// 이 화면으로 오는 진입점(홈 "사물함 상태" 퀵링크 `1737:218284` 또는 공지 상세 CTA)은
// 해당 화면을 만들 때 붙인다.
function LockersApplyScreen() {
  const navigate = useNavigate();

  return (
    <LockersNoticeSheet
      isApplyPeriod={IS_LOCKERS_APPLY_PERIOD}
      onClose={() => navigate(-1)}
      onConfirm={() => navigate("/lockers/apply/sections")}
      open
    />
  );
}

export default LockersApplyScreen;
