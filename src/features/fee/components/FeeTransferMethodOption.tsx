import { RadioGroupItem, Typography } from "@wanteddev/wds";

import type { FeeTransferMethod } from "@/features/fee/constants/feeTransferFunnel";

interface FeeTransferMethodOptionProps {
  value: FeeTransferMethod;
  title: string;
  /** 고르면 어떻게 보내는지 한 줄 안내 */
  caption: string;
  selected: boolean;
}

// 송금 방법 단계의 선택 카드 하나 — 부모의 WDS `RadioGroup` 안에 둔다. Figma에 없는 화면이다.
// `RadioGroupItem`은 label prop이 없어서(행사 신청 폼과 같은 사정) 카드 전체를 `<label htmlFor>`로 감싸
// 카드 어디를 눌러도 고를 수 있게 한다. 고른 카드는 Primary 테두리와 옅은 파랑 배경으로 표시한다.
// 테두리는 `outline`으로 그린다 — `border`는 박스 크기를 2px씩 먹는다(업로드한 이미지 카드와 같은 이유).
function FeeTransferMethodOption({
  value,
  title,
  caption,
  selected,
}: FeeTransferMethodOptionProps) {
  const id = `fee-transfer-method-${value}`;

  return (
    <label
      className={`flex items-start gap-3 rounded-xl p-4 outline-1 -outline-offset-1 ${
        selected
          ? "bg-blue-99 outline-primary"
          : "bg-background-normal outline-line-normal-neutral"
      }`}
      htmlFor={id}
    >
      <RadioGroupItem id={id} size="small" value={value} />
      <span className="flex flex-col gap-1">
        <Typography
          as="span"
          color="semantic.label.normal"
          variant="body1"
          weight="bold"
        >
          {title}
        </Typography>
        <Typography
          as="span"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          {caption}
        </Typography>
      </span>
    </label>
  );
}

export default FeeTransferMethodOption;
