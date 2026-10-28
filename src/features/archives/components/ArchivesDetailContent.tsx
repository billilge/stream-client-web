import { useSuspenseQuery } from "@tanstack/react-query";
import { IconButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconShare } from "@wanteddev/wds-icon";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { archivesQueries } from "@/entities/archives/archivesApi";
import ArchivesDetailSection from "@/features/archives/components/ArchivesDetailSection";
import ArchivesPhotoGrid from "@/features/archives/components/ArchivesPhotoGrid";

interface ArchivesDetailContentProps {
  archiveId: string;
  onBack: () => void;
  onMorePhotos: () => void;
}

// Figma: 아카이빙 상세 (nodeId 1526:171215)
// 아카이빙 데이터를 받아 그리는 부분. 받는 동안은 ArchivesDetailScreen의 Suspense가
// ArchivesDetailSkeleton을 보여준다. 이동 같은 화면 동작은 Screen이 콜백으로 넘긴다.
// 공유 버튼·관련 페이지 링크는 연결할 동작/URL이 아직 없어 표시만 한다.
function ArchivesDetailContent({
  archiveId,
  onBack,
  onMorePhotos,
}: ArchivesDetailContentProps) {
  const { data: archive } = useSuspenseQuery(archivesQueries.detail(archiveId));

  if (!archive) {
    return (
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
    );
  }

  const infoRows = [
    { label: "일시", value: archive.schedule },
    { label: "장소", value: archive.location },
    { label: "담당 부서", value: archive.department },
  ];

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-6 pb-4">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={archive.image}
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
                onClick={onBack}
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
            {archive.title}
          </Typography>
          {/* 라벨 칸은 Figma의 51px을 최소폭으로만 쓴다 — 고정하면 "담당 부서"처럼 긴 라벨이 칸을 넘친다 */}
          <dl className="grid grid-cols-[minmax(51px,auto)_1fr] gap-x-4 gap-y-2">
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
            {archive.activity}
          </Typography>
        </ArchivesDetailSection>

        <ArchivesDetailSection icon="camera" title="현장 사진">
          <ArchivesPhotoGrid
            onMoreClick={onMorePhotos}
            photos={archive.photos}
          />
        </ArchivesDetailSection>

        <ArchivesDetailSection icon="link" title="관련 페이지">
          {archive.links.map((link) => (
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
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesDetailContent;
