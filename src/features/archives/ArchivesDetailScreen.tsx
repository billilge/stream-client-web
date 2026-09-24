import { IconButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconShare } from "@wanteddev/wds-icon";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ArchivesDetailSection from "@/features/archives/components/ArchivesDetailSection";
import ArchivesPhotoGrid from "@/features/archives/components/ArchivesPhotoGrid";
import { ARCHIVES_DETAIL } from "@/features/archives/constants/archivesDetail";

// Figma: 아카이빙 상세 (nodeId 1526:171215)
// 내용은 API 연동 전까지 라우트의 archiveId와 무관하게 목업 하나를 보여준다 —
// 그래서 목록에서 어떤 카드를 눌러도 같은 내용이 뜬다. archiveId로 조회하는 건 API 연동 때 함께 한다.
// 공유 버튼·관련 페이지 링크는 연결할 동작/URL이 아직 없어 표시만 한다.
function ArchivesDetailScreen() {
  const navigate = useNavigate();
  const { archiveId } = useParams();
  const { title, image, date, location, department, activity, photos, links } =
    ARCHIVES_DETAIL;

  const infoRows = [
    { label: "일시", value: date },
    { label: "장소", value: location },
    { label: "담당 부서", value: department },
  ];

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      {/* sm:pb-[34px]: Figma 하단 Home Bar 여백 — 앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 둔다 */}
      <div className="flex flex-col gap-6 pb-4 sm:pb-[34px]">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={image}
          />
          {/* 흰 버튼이 밝은 사진 위에서도 보이도록 상단만 어둡게 덮는다(Figma Gradient Overlay 187px) */}
          <div className="absolute inset-x-0 top-0 h-[187px] bg-linear-to-b from-hero-overlay to-transparent" />
          <ScreenHeader
            // Figma의 흰 아이콘 버튼 — TopNavigationButton은 color를 primary/assistive로만 받아서,
            // 같은 컴포넌트가 내부에서 렌더링하는 WDS IconButton(Button/Icon/Normal)을 직접 쓴다.
            leading={
              <IconButton
                aria-label="뒤로가기"
                color="semantic.static.white"
                onClick={() => navigate(-1)}
                size={24}
                variant="normal"
              >
                <IconChevronLeft />
              </IconButton>
            }
            trailing={
              <IconButton
                aria-label="공유"
                color="semantic.static.white"
                size={24}
                variant="normal"
              >
                <IconShare />
              </IconButton>
            }
            variant="floating"
          />
        </div>

        <div className="flex flex-col gap-4 px-5">
          <Typography
            as="h2"
            color="semantic.label.strong"
            variant="heading1"
            weight="bold"
          >
            {title}
          </Typography>
          <dl className="grid grid-cols-[51px_1fr] gap-x-4 gap-y-2">
            {infoRows.map(({ label, value }) => (
              <div className="contents" key={label}>
                <Typography
                  as="dt"
                  color="semantic.label.alternative"
                  sx={{ whiteSpace: "nowrap" }}
                  variant="label1"
                  weight="regular"
                >
                  {label}
                </Typography>
                <Typography
                  as="dd"
                  color="semantic.label.neutral"
                  variant="label1"
                  weight="medium"
                >
                  {value}
                </Typography>
              </div>
            ))}
          </dl>
        </div>

        <ArchivesDetailSection icon="activity" title="활동 내용">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="label1-reading"
            weight="regular"
          >
            {activity}
          </Typography>
        </ArchivesDetailSection>

        <ArchivesDetailSection icon="camera" title="현장 사진">
          <ArchivesPhotoGrid
            onMoreClick={() => navigate(`/archives/${archiveId}/photos`)}
            photos={photos}
          />
        </ArchivesDetailSection>

        <ArchivesDetailSection icon="link" title="관련 페이지">
          {links.map((link) => (
            <Typography
              as="p"
              color="semantic.label.normal"
              key={link}
              sx={{ textDecoration: "underline" }}
              variant="label1"
              weight="regular"
            >
              {link}
            </Typography>
          ))}
        </ArchivesDetailSection>
      </div>
    </div>
  );
}

export default ArchivesDetailScreen;
