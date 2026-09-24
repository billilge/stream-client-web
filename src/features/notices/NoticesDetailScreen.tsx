import {
  ContentBadge,
  PageCounter,
  type ThemeColorsToken,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import {
  NOTICES,
  type NoticeCategory,
} from "@/features/notices/constants/notices";

const CATEGORY_BADGE_COLOR: Record<NoticeCategory, ThemeColorsToken> = {
  일반: "semantic.accent.foreground.blue",
  제휴: "semantic.accent.foreground.redOrange",
};

// Figma: 공지 상세 (nodeId 1256:81842), 공지 상세 - 사진 없을 때 (nodeId 1256:81856)
function NoticesDetailScreen() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const notice = NOTICES.find((item) => item.id === noticeId);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  if (!notice) {
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

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col gap-5 overflow-y-auto">
      {notice.hasThumbnail && (
        <div className="flex h-[375px] w-full shrink-0 items-end justify-end bg-thumbnail-placeholder p-5">
          <PageCounter
            currentPage={1}
            size="small"
            totalPages={notice.photoCount ?? 1}
          />
        </div>
      )}

      <div className="flex flex-col gap-5 px-5 pb-8">
        <div className="flex flex-col gap-2">
          <ContentBadge
            accentColor={CATEGORY_BADGE_COLOR[notice.category]}
            color="accent"
            size="medium"
            variant="solid"
          >
            {notice.category} 공지
          </ContentBadge>
          <div className="flex flex-col gap-1">
            <Typography
              color="semantic.label.normal"
              noWrap
              variant="heading2"
              weight="bold"
            >
              {notice.title}
            </Typography>
            <Typography
              color="semantic.label.assistive"
              variant="label2"
              weight="regular"
            >
              등록일 {notice.date}
            </Typography>
          </div>
        </div>

        <Typography
          as="p"
          color="semantic.label.normal"
          sx={{ whiteSpace: "pre-wrap" }}
          variant="label1-reading"
          weight="regular"
        >
          {notice.body}
        </Typography>
      </div>
    </div>
  );
}

export default NoticesDetailScreen;
