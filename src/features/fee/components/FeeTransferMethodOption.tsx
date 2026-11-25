import { RadioGroupItem, Typography } from "@wanteddev/wds";

import type { FeeTransferMethod } from "@/features/fee/constants/feeTransferFunnel";

interface FeeTransferMethodOptionProps {
  value: FeeTransferMethod;
  title: string;
  /** 고르면 어떻게 보내는지 한 줄 안내 */
  caption: string;
  selected: boolean;
}

// Figma: 송금 방식 옵션(5365:89336)의 카드 하나(토스로 송금 5365:89337 / 계좌이체 5365:89339) — 부모의 WDS `RadioGroup` 안에 둔다.
// `RadioGroupItem`은 label prop이 없어서(행사 신청 폼과 같은 사정) 카드 전체를 `<label htmlFor>`로 감싸
// 카드 어디를 눌러도 고를 수 있게 한다. 고른 카드는 Primary 테두리와 옅은 파랑 배경으로 표시한다.
// 테두리는 `outline`으로 그린다 — `border`는 박스 크기를 2px씩 먹는다(업로드한 이미지 카드와 같은 이유).
//
// 라디오는 높이 24px 틀(Figma Leading Content) 가운데에 두고, 제목 줄도 최소 24px로 가운데 맞춘다 —
// 라디오(20px)를 카드 위끝에 붙이면 제목 글자보다 2px 위로 뜬다(Figma 수정 5364:3183).
// WDS small 라디오는 원(16px) 둘레에 padding 2px을 둔 20px 상자다. Figma는 원이 카드 안쪽 끝에 붙고 원 뒤에
// 2px + 간격 8px이라, 왼쪽으로 2px 당기고(-ml-0.5) 오른쪽 2px은 라디오 padding이 대신한다 — 원·제목 위치가 Figma와 같다.
function FeeTransferMethodOption({
  value,
  title,
  caption,
  selected,
}: FeeTransferMethodOptionProps) {
  const id = `fee-transfer-method-${value}`;

  return (
    <label
      className={`flex items-start gap-2 rounded-xl px-4 py-3.5 outline-1 -outline-offset-1 ${
        selected
          ? "bg-blue-99 outline-primary"
          : "bg-background-normal outline-line-normal-normal"
      }`}
      htmlFor={id}
    >
      <span className="-ml-0.5 flex h-6 shrink-0 items-center">
        <RadioGroupItem id={id} size="small" value={value} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="flex min-h-6 items-center">
          <Typography
            as="span"
            color="semantic.label.normal"
            variant="body2"
            weight="bold"
          >
            {title}
          </Typography>
        </span>
        <Typography
          as="span"
          color="semantic.label.alternative"
          variant="label2"
          weight="regular"
        >
          {caption}
        </Typography>
      </span>
    </label>
  );
}

export default FeeTransferMethodOption;
