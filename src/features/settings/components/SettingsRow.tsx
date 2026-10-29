import { Typography } from "@wanteddev/wds";

import arrowRight from "@/assets/icons/settings/arrow-right.svg";

interface SettingsRowBaseProps {
  label: string;
  /** 오른쪽에 붙는 값 — 계정 정보(이름·이메일·전화번호)와 앱 버전에만 있다 */
  value?: string;
  /** 넘기면 행 전체가 버튼이 되고 오른쪽에 화살표가 붙는다 */
  onClick?: () => void;
}

/** 계정 정보 행 — 라벨 Regular, 값 Medium·Label/Neutral. 색은 고정이라 tone을 받지 않는다. */
interface SettingsAccountRowProps extends SettingsRowBaseProps {
  variant: "account";
}

/** 그 외 메뉴·액션 행 — 라벨 Medium, 값 Regular·Label/Alternative(앱 버전) */
interface SettingsMenuRowProps extends SettingsRowBaseProps {
  variant?: "menu";
  /** menu 행 라벨 색 — 로그아웃은 alternative, 회원 탈퇴는 negative */
  tone?: "normal" | "alternative" | "negative";
  /**
   * 갈 곳이 아직 없는 행(구글폼 주소 미정). 라벨을 Label/Assistive로 낮추고 실제로 못 누르게
   * `disabled` 버튼으로 그린다 — 누를 수 있어 보이는데 반응이 없는 상태를 없앤다.
   */
  disabled?: boolean;
}

// variant별로 나눠 둬서 `variant="account"`에 tone을 같이 넘기는 잘못된 조합이 타입에서 걸린다.
type SettingsRowProps = SettingsAccountRowProps | SettingsMenuRowProps;

const TONE_COLOR = {
  alternative: "semantic.label.alternative",
  negative: "semantic.status.negative",
  normal: "semantic.label.neutral",
} as const;

// Figma: 설정 화면(nodeId 3524:152322)의 행들 — Account Row(3524:152332), Navigation Row
// (3524:152344), Info Row(3524:152356), Action Row(3524:152360)가 같은 높이(20px)·같은
// justify-between 구조라 한 컴포넌트의 variant/tone으로 합쳤다. 넷의 차이는 라벨 굵기(계정
// 정보만 Regular)와 라벨 색(로그아웃 alternative·회원 탈퇴 negative)뿐이다.
// 화살표는 Figma에서 앱 버전 행에만 없는데, 그 행만 누를 수 없어서 onClick 유무로 갈린다.
//
// 화살표는 Figma `Arrow`(445:12456) — WDS에 같은 이름이 없고(검색 결과 `Icon/Normal/Arrow *`·
// `Chevron *`뿐) wds-component-usage.md에도 Stream 전용 아이콘으로 분류돼 있어 SVG로 받아 쓴다.
// 색(#C2C4C8 = Atomic/Cool Neutral/90)이 에셋에 구워져 있어 토큰을 따로 추가하지 않았다.
// 비활성 행에서 화살표를 따로 흐리게 하지 않는 건, 이 색이 흰 배경 위 `Label/Assistive`
// (#37383C 28% → 약 #C7C7C9)와 사실상 같은 밝기여서 라벨만 낮춰도 행 전체가 고르게 흐려지기
// 때문이다. 비활성 색을 Figma가 쓰는 Label/Assistive로 맞춘 이유는 아래 Figma 주석 참고.
//
// 라벨·값은 Typography 기본 태그(span)로 둔다 — onClick이 있으면 행 전체가 <button>이 되는데
// <button>은 phrasing content만 담을 수 있어서 as="p"를 쓰면 무효 마크업이 된다.
function SettingsRow(props: SettingsRowProps) {
  const { label, value, onClick } = props;
  const isAccount = props.variant === "account";
  const tone = isAccount ? "normal" : (props.tone ?? "normal");
  const isDisabled = !isAccount && props.disabled === true;
  const showArrow = Boolean(onClick);

  const content = (
    <>
      <Typography
        color={
          isDisabled
            ? "semantic.label.assistive"
            : isAccount
              ? "semantic.label.neutral"
              : TONE_COLOR[tone]
        }
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
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export default SettingsRow;
