import type { ReactNode } from "react";
import {
  Navigate,
  type NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import documentLock from "@/assets/icons/common/document-lock.svg";
import networkOffline from "@/assets/icons/lockers/network-offline.svg";
import ResultScreen from "@/components/ui/ResultScreen";
import SubmittingOverlay from "@/components/ui/SubmittingOverlay";
import {
  LOCKERS_APPLY_SUBMITTING_TEXT,
  type LockersApplyFailureReason,
} from "@/features/lockers/constants/lockersApplySubmit";
import {
  type LockersApplyFailureState,
  useLockersApplySubmit,
} from "@/features/lockers/hooks/useLockersApplySubmit";

// Figma는 자물쇠 그림(62.96×72.32)을 80×80 틀 가운데에 둔다
const LOCK_ILLUSTRATION = (
  <div className="flex size-20 items-center justify-center">
    <img alt="" className="h-[72.317px] w-[62.963px]" src={documentLock} />
  </div>
);

interface FailureContentContext {
  sectionId: string;
  navigate: NavigateFunction;
  retry: () => void;
}

interface FailureContent {
  illustration: ReactNode;
  title: string;
  description: string;
  primaryAction: { label: string; onClick: () => void };
  hasHomeAction: boolean;
  // 다시 시도할 사물함이 있어야 화면이 동작한다(network·server)
  needsRetryRequest?: boolean;
}

// Figma: 다른 사용자와 겹침 (nodeId 3013:99093), 전체 마감 (3013:99116), 구역 마감 (3013:99139),
// 네트워크 오류 (3013:99162), 서버 오류 (3013:99183)
const FAILURE_CONTENTS: Record<
  LockersApplyFailureReason,
  (context: FailureContentContext) => FailureContent
> = {
  "all-closed": ({ navigate }) => ({
    description: "다음 기회에 다시 이용해 주세요.",
    hasHomeAction: false,
    illustration: LOCK_ILLUSTRATION,
    primaryAction: { label: "홈으로 가기", onClick: () => navigate("/") },
    title: "사물함 신청이 모두 마감됐어요",
  }),
  network: ({ retry }) => ({
    description: "연결 상태를 확인한 후 다시 시도해 주세요.",
    hasHomeAction: true,
    illustration: <img alt="" className="size-20" src={networkOffline} />,
    needsRetryRequest: true,
    primaryAction: { label: "다시 시도", onClick: retry },
    title: "인터넷 연결이 원활하지 않아요",
  }),
  "section-closed": ({ sectionId, navigate }) => ({
    description: "다른 구역의 사물함을 확인해 보세요.",
    hasHomeAction: true,
    illustration: LOCK_ILLUSTRATION,
    primaryAction: {
      label: "다른 구역 선택하기",
      onClick: () => navigate("/lockers/apply/sections", { replace: true }),
    },
    title: `${sectionId} 구역의 사물함이 마감됐어요`,
  }),
  server: ({ retry }) => ({
    description: "잠시 후 다시 시도해 주세요.",
    hasHomeAction: true,
    illustration: LOCK_ILLUSTRATION,
    needsRetryRequest: true,
    primaryAction: { label: "다시 시도", onClick: retry },
    title: "일시적인 오류가 발생했어요",
  }),
  taken: ({ sectionId, navigate }) => ({
    description: "다른 사물함으로 다시 신청해 주세요.",
    hasHomeAction: true,
    illustration: LOCK_ILLUSTRATION,
    primaryAction: {
      label: "다시 선택하기",
      onClick: () =>
        navigate(`/lockers/apply/sections/${sectionId}`, { replace: true }),
    },
    title: "선택한 사물함이 방금 마감됐어요",
  }),
};

function isFailureReason(
  reason: string | undefined,
): reason is LockersApplyFailureReason {
  // in은 constructor·toString 같은 기본 속성까지 통과시켜서 직접 정의한 키만 본다
  return reason !== undefined && Object.hasOwn(FAILURE_CONTENTS, reason);
}

function LockersApplyFailureScreen() {
  const navigate = useNavigate();
  const { sectionId = "", reason } = useParams();
  const state = useLocation().state as LockersApplyFailureState | null;
  const { isSubmitting, submit } = useLockersApplySubmit(sectionId);

  if (!isFailureReason(reason)) {
    return <Navigate replace to="/" />;
  }

  const content = FAILURE_CONTENTS[reason]({
    navigate,
    retry: () => {
      if (state?.request) {
        submit(state.request);
      }
    },
    sectionId,
  });

  // 신청 직후에만 오는 화면이라, 주소로 바로 들어와 다시 신청할 사물함을 모르면 홈으로 보낸다
  if (content.needsRetryRequest && !state?.request) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <ResultScreen
        description={content.description}
        illustration={content.illustration}
        onClose={() => navigate("/")}
        primaryAction={content.primaryAction}
        secondaryAction={
          content.hasHomeAction
            ? { label: "홈으로 가기", onClick: () => navigate("/") }
            : undefined
        }
        title={content.title}
      />
      <SubmittingOverlay
        description={LOCKERS_APPLY_SUBMITTING_TEXT.description}
        open={isSubmitting}
        title={LOCKERS_APPLY_SUBMITTING_TEXT.title}
      />
    </>
  );
}

export default LockersApplyFailureScreen;
