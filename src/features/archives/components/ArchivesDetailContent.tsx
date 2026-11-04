import { useSuspenseQuery } from "@tanstack/react-query";
import { IconButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconShare } from "@wanteddev/wds-icon";
import { useState } from "react";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import ArchivesDetailSection from "@/features/archives/components/ArchivesDetailSection";
import ArchivesNotFound from "@/features/archives/components/ArchivesNotFound";
import ArchivesPhotoGrid from "@/features/archives/components/ArchivesPhotoGrid";
import { ARCHIVES_PATH } from "@/features/archives/constants/archives";
import { formatDate } from "@/lib/date";
import { archivesQueries } from "@/shared/entities/archives/archivesQueries";
import type { ArchiveDetailResponse } from "@/shared/entities/archives/archivesTypes";

interface ArchivesDetailContentProps {
  archiveId: number;
  onBack: () => void;
  onMorePhotos: () => void;
  onRelatedEventClick: (eventId: number) => void;
}

// "2025.05.04(금)", 여러 날이면 "2025.05.04(금) - 2025.05.06(일)"
function formatSchedule({ startDate, endDate }: ArchiveDetailResponse) {
  const start = formatDate(startDate, { weekday: true });
  if (!endDate || endDate === startDate) {
    return start;
  }
  return `${start} - ${formatDate(endDate, { weekday: true })}`;
}

// Figma: 아카이빙 상세 (nodeId 1526:171215)
// 아카이빙 데이터를 받아 그리는 부분. 받는 동안은 ArchivesDetailScreen의 Suspense가
// ArchivesDetailSkeleton을 보여준다. 이동 같은 화면 동작은 Screen이 콜백으로 넘긴다.
function ArchivesDetailContent({
  archiveId,
  onBack,
  onMorePhotos,
  onRelatedEventClick,
}: ArchivesDetailContentProps) {
  const { data: archive } = useSuspenseQuery(archivesQueries.detail(archiveId));
  const [shareToast, setShareToast] = useState<{
    open: boolean;
    copied: boolean;
  }>({ open: false, copied: true });
  // 토스트가 떠 있는 중에 다시 눌러도 스크린리더가 재안내하도록 매번 새로 마운트한다
  const [shareToastToken, setShareToastToken] = useState(0);

  const handleShare = async () => {
    let copied = true;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${ARCHIVES_PATH}/${archiveId}`,
      );
    } catch {
      copied = false;
    }
    setShareToast({ open: true, copied });
    setShareToastToken((token) => token + 1);
  };

  if (!archive) {
    return <ArchivesNotFound withHeader />;
  }

  const { relatedEvent } = archive;
  const coverUrl = archive.images[0]?.fileUrl;
  const infoRows = [
    { label: "일시", value: formatSchedule(archive) },
    { label: "장소", value: archive.location },
    { label: "담당 부서", value: archive.departmentName },
  ].filter((row) => row.value);

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-6 pb-4">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-thumbnail-placeholder">
          {/* 대표 사진은 현장 사진 첫 장이다(목록의 thumbnailUrl과 같다) */}
          {coverUrl && (
            <img
              alt=""
              className="absolute inset-0 size-full object-cover"
              src={coverUrl}
            />
          )}
          {/* 흰 버튼이 밝은 사진 위에서도 보이도록 상단만 어둡게 덮는다(Figma Gradient Overlay 187px) */}
          <div className="absolute inset-x-0 top-0 h-46.75 bg-linear-to-b from-hero-overlay to-transparent" />
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
                onClick={handleShare}
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
            sx={{ whiteSpace: "pre-line" }}
            variant="label1-reading"
            weight="regular"
          >
            {archive.content}
          </Typography>
        </ArchivesDetailSection>

        {archive.images.length > 0 && (
          <ArchivesDetailSection icon="camera" title="현장 사진">
            <ArchivesPhotoGrid
              onMoreClick={onMorePhotos}
              photos={archive.images.map((image) => image.fileUrl)}
            />
          </ArchivesDetailSection>
        )}

        {relatedEvent && (
          <ArchivesDetailSection icon="link" title="관련 페이지">
            <button
              className="text-left"
              onClick={() => onRelatedEventClick(relatedEvent.eventId)}
              type="button"
            >
              <Typography
                as="span"
                color="semantic.label.normal"
                sx={{ textDecoration: "underline" }}
                variant="label1"
                weight="regular"
              >
                {relatedEvent.title}
              </Typography>
            </button>
          </ArchivesDetailSection>
        )}
      </div>
      <ScreenBottomSafeArea />

      <ScreenToast
        key={shareToastToken}
        message={
          shareToast.copied ? "링크를 복사했어요." : "링크를 복사하지 못했어요."
        }
        onOpenChange={(open) => setShareToast((prev) => ({ ...prev, open }))}
        open={shareToast.open}
        variant={shareToast.copied ? "positive" : "negative"}
      />
    </div>
  );
}

export default ArchivesDetailContent;
