import { Checkbox, Typography } from "@wanteddev/wds";
import { useId } from "react";

import arrowRightIcon from "@/assets/icons/auth/arrow-right.svg";

interface AuthTermsAgreementRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** 있으면 오른쪽에 화살표가 붙고 눌러서 약관 상세로 간다 — "전체 동의하기" 행에는 없다 */
  onOpenDetail?: () => void;
  /** 전체 동의 행은 글자가 SemiBold(Body 2/Bold), 개별 약관 행은 Regular다 */
  isBold?: boolean;
}

// Figma: Control/Checkbox 행 — 전체 동의하기(nodeId 3658:112647), 개별 약관 행(3658:112650 외).
// WDS Checkbox는 label prop이 없고 `<button role="checkbox">`로 그려져서, 옆에 `<label htmlFor>`를 두어
// 글자를 눌러도 체크되게 한다(행사 신청 폼과 같은 방식). 크기는 행사 신청 폼의 `small`(20px)이 아니라
// Figma Control이 24px(박스 18 + 패딩 3)라서 `medium`이다(checkbox/style.js 실측).
function AuthTermsAgreementRow({
  label,
  checked,
  onCheckedChange,
  onOpenDetail,
  isBold = false,
}: AuthTermsAgreementRowProps) {
  const id = useId();

  return (
    <div
      className={`flex items-center justify-between ${
        onOpenDetail ? "h-10 py-3" : "py-3"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <Checkbox
          checked={checked}
          id={id}
          onCheckedChange={onCheckedChange}
          size="medium"
        />
        <label className="min-w-0 flex-1 py-px" htmlFor={id}>
          <Typography
            as="span"
            color="semantic.label.normal"
            variant="body2"
            weight={isBold ? "bold" : "regular"}
          >
            {label}
          </Typography>
        </label>
      </div>
      {onOpenDetail && (
        // 화살표 아이콘은 12px이라 누르기 어렵다 — 둘레로 눌리는 영역만 넓히고 배치는 그대로 둔다
        <button
          aria-label={`${label} 상세 보기`}
          className="-m-2 flex shrink-0 p-2"
          onClick={onOpenDetail}
          type="button"
        >
          <img alt="" className="size-3" src={arrowRightIcon} />
        </button>
      )}
    </div>
  );
}

export default AuthTermsAgreementRow;
