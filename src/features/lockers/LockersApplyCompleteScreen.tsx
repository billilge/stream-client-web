import { Typography } from "@wanteddev/wds";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import type { LockersApplyCompleteState } from "@/features/lockers/hooks/useLockersApplySubmit";

// 사물함 신청내역은 사물함 배정 상태 화면이다
const APPLICATION_HISTORY_PATH = "/my/locker";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-09-01" → "2026.09.01(화)". 시간대에 따라 날짜가 밀리지 않게 문자열을 직접 나눠 읽는다.
function formatUsageDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${date.replaceAll("-", ".")}(${weekday})`;
}

// Figma: 사물함 신청 완료 페이지 (nodeId 1737:218058)
function LockersApplyCompleteScreen() {
  const navigate = useNavigate();
  const state = useLocation().state as LockersApplyCompleteState | null;

  // 신청 직후에만 오는 화면이라, 주소로 바로 들어와 신청 결과가 없으면 홈으로 보낸다
  if (!state?.application) {
    return <Navigate replace to="/" />;
  }
  const { lockerLabel, usageStartDate, usageEndDate } = state.application;

  return (
    <ResultScreen
      description="신청 정보를 확인해 보세요"
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={() => navigate("/")}
      primaryAction={{ label: "홈으로 가기", onClick: () => navigate("/") }}
      secondaryAction={{
        label: "신청내역 보기",
        onClick: () => navigate(APPLICATION_HISTORY_PATH),
      }}
      title="신청이 완료됐어요"
    >
      {/* Figma: Locker Summary (nodeId 1737:218070) */}
      <div className="flex flex-col gap-2 rounded-xl bg-background-alternative px-4 py-5">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          <Typography
            as="span"
            color="semantic.primary.normal"
            variant="headline2"
            weight="bold"
          >
            {lockerLabel}
          </Typography>{" "}
          사물함
        </Typography>
        <div className="flex gap-2">
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            사용기간
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="medium"
          >
            {formatUsageDate(usageStartDate)} - {formatUsageDate(usageEndDate)}
          </Typography>
        </div>
      </div>
    </ResultScreen>
  );
}

export default LockersApplyCompleteScreen;
