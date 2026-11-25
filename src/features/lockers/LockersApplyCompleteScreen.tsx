import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@wanteddev/wds";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import { HOME_PATH } from "@/features/home/constants/home";
import { LOCKER_ASSIGNMENT_PATH } from "@/features/lockers/constants/lockers";
import type { LockersApplyCompleteState } from "@/features/lockers/hooks/useLockersApplySubmit";
import { formatDate } from "@/lib/date";
import { homeQueries } from "@/shared/entities/home/homeQueries";
import { lockersQueries } from "@/shared/entities/lockers/lockersQueries";

// Figma: 사물함 신청 완료 페이지 (nodeId 1737:218058)
function LockersApplyCompleteScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const state = useLocation().state as LockersApplyCompleteState | null;

  // 받기를 기다리는 이동. 그동안 다른 버튼을 눌러도 무시해서 늦게 끝난 쪽으로 끌려가지 않게 한다
  const [pending, setPending] = useState<"home" | "history" | null>(null);

  // 신청이 무효화한 홈·내 신청 내역을 이 화면에 있는 동안 받아 둔다
  useEffect(() => {
    queryClient.prefetchQuery(homeQueries.home());
    queryClient.prefetchQuery(lockersQueries.myApplications());
  }, [queryClient]);

  // 다음 화면이 예전 값(신청 전 홈·"신청내역이 없어요")을 보이지 않게, 받기를 마친 뒤에 넘어간다. 받는 중이면
  // 그 요청을 같이 기다린다. 실패해도 넘어가서 다음 화면이 다시 받는다
  const openAfterFetch = async (target: "home" | "history") => {
    if (pending) {
      return;
    }
    setPending(target);
    if (target === "home") {
      await queryClient.fetchQuery(homeQueries.home()).catch(() => undefined);
      navigate(HOME_PATH);
      return;
    }
    await queryClient
      .fetchQuery(lockersQueries.myApplications())
      .catch(() => undefined);
    navigate(LOCKER_ASSIGNMENT_PATH);
  };

  // 신청 직후에만 오는 화면이라, 주소로 바로 들어와 신청 결과가 없으면 홈으로 보낸다
  if (!state?.application) {
    return <Navigate replace to={HOME_PATH} />;
  }
  const { lockerLabel, usageStartDate, usageEndDate } = state.application;

  return (
    <ResultScreen
      description="신청 정보를 확인해 보세요"
      illustration={<CompleteCheck />}
      illustrationGap={8}
      onClose={() => openAfterFetch("home")}
      primaryAction={{
        label: "홈으로 가기",
        loading: pending === "home",
        onClick: () => openAfterFetch("home"),
      }}
      secondaryAction={{
        label: "신청내역 보기",
        loading: pending === "history",
        // 사물함 신청내역은 사물함 배정 상태 화면이다
        onClick: () => openAfterFetch("history"),
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
            {formatDate(usageStartDate, { weekday: true })} -{" "}
            {formatDate(usageEndDate, { weekday: true })}
          </Typography>
        </div>
      </div>
    </ResultScreen>
  );
}

export default LockersApplyCompleteScreen;
