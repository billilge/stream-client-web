import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LockersNoticeSheet from "@/features/lockers/components/LockersNoticeSheet";
import { IS_LOCKERS_APPLY_PERIOD } from "@/features/lockers/constants/lockersNotice";

// BottomSheet의 시트 내려가는 시간(duration-[380ms])과 맞춘다 — 다 내려간 뒤에 화면을 떠난다
const SHEET_CLOSE_MS = 380;

// Figma: 사물함 신청 전 유의사항 (nodeId 1737:218213)
// 신청 흐름의 첫 화면이다 — 들어오면 유의사항 시트부터 띄우고, 확인하면 구역 선택으로 보낸다.
// 시트를 닫으면(딤 탭) 들어온 곳으로 돌아간다.
//
// 이 화면으로 오는 진입점(홈 "사물함 상태" 퀵링크 `1737:218284` 또는 공지 상세 CTA)은
// 해당 화면을 만들 때 붙인다.
function LockersApplyScreen() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 처음부터 open으로 그리면 시트가 올라오는 전환 없이 바로 떠 있다. 닫힌 상태가 한 번 그려진 뒤
  // 열어야 BottomSheet의 전환이 보여서 두 프레임 뒤에 연다.
  useEffect(() => {
    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => setIsOpen(true));
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate(-1), SHEET_CLOSE_MS);
  };

  return (
    <LockersNoticeSheet
      isApplyPeriod={IS_LOCKERS_APPLY_PERIOD}
      onClose={handleClose}
      onConfirm={() => navigate("/lockers/apply/sections")}
      open={isOpen}
    />
  );
}

export default LockersApplyScreen;
