import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { ARCHIVES_PATH } from "@/features/archives/constants/archives";

interface ArchivesNotFoundProps {
  // 화면이 헤더를 따로 등록하지 않는 상세·사진 뷰어만 켠다 — 아카이빙 화면은 하단 탭이 없어 이 버튼이 유일한 출구다
  withHeader?: boolean;
}

// 없는 아카이빙(서버 404)이나 숫자가 아닌 주소로 들어왔을 때 상세·현장 사진·사진 뷰어가 같이 쓰는 빈 화면
function ArchivesNotFound({ withHeader = false }: ArchivesNotFoundProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-1 flex-col">
      {withHeader && (
        <ScreenHeader
          leading={
            <TopNavigationButton
              aria-label="뒤로가기"
              // 주소로 바로 들어와 앱 안의 이전 기록이 없으면 앱 밖으로 나가지 않게 목록으로 보낸다
              onClick={() =>
                location.key === "default"
                  ? navigate(ARCHIVES_PATH, { replace: true })
                  : navigate(-1)
              }
              variant="icon"
            >
              <IconChevronLeft />
            </TopNavigationButton>
          }
          variant="normal"
        />
      )}
      <div className="flex flex-1 items-center justify-center">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          존재하지 않는 아카이빙이에요
        </Typography>
      </div>
    </div>
  );
}

export default ArchivesNotFound;
