import { Typography } from "@wanteddev/wds";
import { IconUpload } from "@wanteddev/wds-icon";
import { useId } from "react";

import { FEE_TRANSCRIPT_ACCEPT } from "@/features/fee/constants/fee";

interface FeeImageUploadButtonProps {
  onSelect: (file: File) => void;
}

// Figma: Image Upload Button (nodeId 3716:23609) — WDS가 아니라 Stream 로컬 컴포넌트다.
// `search_design_system`에 같은 모양의 아웃라인 버튼이 없고, 안쪽 아이콘만 WDS
// `Icon/Normal/Upload`(3716:22984)다. WDS Button의 outlined는 radius·높이가 달라서 쓰지 않는다.
//
// 파일 선택은 보이지 않는 <input type="file">에 위임한다 — label로 감싸면 버튼 모양을 그대로
// 두면서도 키보드·스크린리더에서 하나의 컨트롤로 읽힌다.
function FeeImageUploadButton({ onSelect }: FeeImageUploadButtonProps) {
  const inputId = useId();

  return (
    <label
      className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-1 rounded-[10px] border border-line-normal-neutral"
      htmlFor={inputId}
    >
      <IconUpload className="size-[18px] text-primary" />
      <Typography
        as="span"
        color="semantic.primary.normal"
        variant="body2"
        weight="bold"
      >
        이미지를 업로드해 주세요
      </Typography>
      <input
        accept={FEE_TRANSCRIPT_ACCEPT}
        className="sr-only"
        id={inputId}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onSelect(file);
          }
          // 같은 파일을 다시 고를 수 있도록 값을 비운다 — 안 비우면 change가 안 터진다
          event.target.value = "";
        }}
        type="file"
      />
    </label>
  );
}

export default FeeImageUploadButton;
