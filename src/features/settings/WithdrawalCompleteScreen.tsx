import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

// 탈퇴하면 로그아웃된 상태라 로그인/온보딩으로 나가야 하지만 아직 그 화면이 없다 —
// 인증을 붙일 때 이 상수만 바꾼다. 그때까지는 행사 신청 완료 화면과 같이 홈으로 내보낸다.
const EXIT_PATH = "/";

// Figma: 탈퇴 완료 페이지 (nodeId 3524:152505)
// 행사 신청 완료 화면(1712:192283)과 같은 뼈대다 — 체크 모션 + 제목/부제, 하단 고정 버튼.
// 다른 점은 신청 정보 카드가 없고 버튼이 "확인" 하나라는 것뿐이라, 공용 컴포넌트로 묶기엔
// 아직 표본이 둘뿐이고 Action Area 구성이 달라서 화면별로 따로 조립한다.
function WithdrawalCompleteScreen() {
  const navigate = useNavigate();

  useScreenHeader(
    <ScreenHeader
      trailing={
        // 탈퇴가 끝난 화면이라 닫아도 탈퇴 폼으로 돌아가지 않는다
        <TopNavigationButton
          aria-label="닫기"
          onClick={() => navigate(EXIT_PATH, { replace: true })}
          variant="icon"
        >
          <IconClose />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col justify-between bg-background-normal">
      {/* Figma Withdrawal Complete Header(3524:152509): 헤더와 메시지 사이 104px */}
      <div className="flex flex-col items-center gap-2 px-5 pt-[104px]">
        <CompleteCheck />
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="heading1"
            weight="bold"
          >
            회원 탈퇴가 완료되었어요
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label1"
            weight="regular"
          >
            그동안 stream과 함께해 주셔서 감사해요.
          </Typography>
        </div>
      </div>

      <div className="shrink-0">
        <ActionArea>
          {/* WDS는 버튼 세로 padding을 12px(48px)로 주는데 Figma Main Action은 16px(56px)이다 */}
          <ActionAreaButton
            onClick={() => navigate(EXIT_PATH, { replace: true })}
            sx={{ padding: "16px 28px" }}
          >
            확인
          </ActionAreaButton>
        </ActionArea>
        {/* 다른 완료 화면과 같은 이유의 14px — WDS ActionArea 아래 padding 20px에 Home Bar 여백을 더해 34px */}
        <div className="h-safe-bottom-extra bg-background-normal sm:h-[14px]" />
      </div>
    </div>
  );
}

export default WithdrawalCompleteScreen;
