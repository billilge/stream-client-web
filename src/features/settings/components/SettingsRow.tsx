import { Typography } from "@wanteddev/wds";

import arrowRight from "@/assets/icons/settings/arrow-right.svg";

interface SettingsRowProps {
  label: string;
  /** 오른쪽에 붙는 값 — 계정 정보(이름·이메일·전화번호)와 앱 버전에만 있다 */
  value?: string;
  /** 넘기면 행 전체가 버튼이 된다 */
  onClick?: () => void;
  /**
   * 오른쪽 화살표. 기본값은 onClick 유무를 따르지만, 회원 탈퇴처럼 Figma엔 화살표가 있는데
   * 누른 뒤 화면이 아직 없는 행은 이 값을 직접 켜준다.
   */
  arrow?: boolean;
  /**
   * account: 계정 정보 행 — 라벨 Regular, 값 Medium·Label/Neutral
   * menu: 그 외 메뉴·액션 행 — 라벨 Medium, 값 Regular·Label/Alternative(앱 버전)
   */
  variant?: "account" | "menu";
  /** menu 행 라벨 색 — 로그아웃은 alternative, 회원 탈퇴는 negative */
  tone?: "normal" | "alternative" | "negative";
}

const TONE_COLOR = {
  alternative: "semantic.label.alternative",
  negative: "semantic.status.negative",
  normal: "semantic.label.neutral",
} as const;

// Figma: 설정 화면(nodeId 3013:116135)의 행들 — Account Row(3013:116144), Navigation Row
// (3013:116159), Info Row(3013:116174), Action Row(3013:116178)가 같은 높이(20px)·같은
// justify-between 구조라 한 컴포넌트의 variant/tone으로 합쳤다. 넷의 차이는 라벨 굵기(계정
// 정보만 Regular)와 라벨 색(로그아웃 alternative·회원 탈퇴 negative)뿐이다.
//
// 화살표는 Figma `Arrow`(445:12456) — WDS에 같은 이름이 없고(검색 결과 `Icon/Normal/Arrow *`·
// `Chevron *`뿐) wds-component-usage.md에도 Stream 전용 아이콘으로 분류돼 있어 SVG로 받아 쓴다.
// 색(#C2C4C8 = Atomic/Cool Neutral/90)이 에셋에 구워져 있어 토큰을 따로 추가하지 않았다.
//
// 라벨·값은 Typography 기본 태그(span)로 둔다 — onClick이 있으면 행 전체가 <button>이 되는데
// <button>은 phrasing content만 담을 수 있어서 as="p"를 쓰면 무효 마크업이 된다.
function SettingsRow({
  label,
  value,
  onClick,
  arrow,
  variant = "menu",
  tone = "normal",
}: SettingsRowProps) {
  const isAccount = variant === "account";
  const showArrow = arrow ?? Boolean(onClick);

  const content = (
    <>
      <Typography
        color={isAccount ? "semantic.label.neutral" : TONE_COLOR[tone]}
        variant="label1"
        weight={isAccount ? "regular" : "medium"}
      >
        {label}
      </Typography>
      <div className="flex items-center gap-2">
        {value && (
          <Typography
            color={
              isAccount
                ? "semantic.label.neutral"
                : "semantic.label.alternative"
            }
            variant="label1"
            weight={isAccount ? "medium" : "regular"}
          >
            {value}
          </Typography>
        )}
        {showArrow && <img alt="" className="h-3 w-2" src={arrowRight} />}
      </div>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex h-5 items-center justify-between">{content}</div>
    );
  }

  return (
    <button
      className="flex h-5 w-full items-center justify-between"
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export default SettingsRow;
