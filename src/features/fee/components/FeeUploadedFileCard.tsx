import { Typography } from "@wanteddev/wds";
import { IconTrash } from "@wanteddev/wds-icon";

import imageFileIcon from "@/assets/icons/fee/image-file.svg";

interface FeeUploadedFileCardProps {
  fileName: string;
  /** 파일 행을 누르면 원본을 크게 본다(업로드한 이미지 미리보기 3595:70574) */
  onPreview: () => void;
  onRemove: () => void;
}

// Figma: Uploaded Image (nodeId 3562:162918)
// 흰 카드 + 1px 테두리 안에 파일 행 하나가 들어간다. 행 배경 Atomic/Blue/99(#F7FBFF)는
// primary-subtle(Blue/95)보다 훨씬 옅은 별개 값이라 index.css에 토큰을 따로 추가했다.
//
// 파일 아이콘(28px)은 WDS가 아니라 Figma가 쓴 `fa7-solid:image` 글리프다 — WDS `IconImage`는
// 외곽선 스타일이라 모양이 달라서 SVG를 받아 커밋했다.
function FeeUploadedFileCard({
  fileName,
  onPreview,
  onRemove,
}: FeeUploadedFileCardProps) {
  return (
    // 테두리는 border가 아니라 outline으로 그린다 — Figma는 335×104 안쪽에 303px 행을 두는데,
    // CSS border는 box-sizing 때문에 가로·세로를 각각 2px씩 깎아먹는다
    <div className="flex flex-col items-center gap-2 rounded-xl bg-background-normal p-4 outline-1 outline-line-normal-neutral -outline-offset-1">
      <Typography
        as="p"
        className="w-full"
        color="semantic.label.normal"
        variant="label1"
        weight="medium"
      >
        업로드한 이미지
      </Typography>
      <div className="flex w-full items-center justify-between rounded-lg bg-blue-99 px-3 py-2">
        <button
          className="flex min-w-0 items-center gap-2"
          onClick={onPreview}
          type="button"
        >
          <img alt="" className="size-7 shrink-0" src={imageFileIcon} />
          <Typography
            as="span"
            className="truncate"
            color="semantic.label.normal"
            variant="label2"
            weight="regular"
          >
            {fileName}
          </Typography>
        </button>
        <button
          aria-label={`${fileName} 삭제`}
          className="shrink-0"
          onClick={onRemove}
          type="button"
        >
          <IconTrash className="size-4 text-label-neutral" />
        </button>
      </div>
    </div>
  );
}

export default FeeUploadedFileCard;
