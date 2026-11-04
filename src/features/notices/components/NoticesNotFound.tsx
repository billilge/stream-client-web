import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";

interface NoticesNotFoundProps {
  onBack: () => void;
}

// 없는 공지 — 삭제됐거나 주소가 잘못됐다. 덮을 사진이 없어서 흰 배경 헤더(뒤로가기)를 쓴다.
function NoticesNotFound({ onBack }: NoticesNotFoundProps) {
  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={onBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex flex-1 items-center justify-center">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label1"
        weight="regular"
      >
        존재하지 않는 공지예요
      </Typography>
    </div>
  );
}

export default NoticesNotFound;
