import { TopNavigation, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

interface ScreenHeaderToggleTitle {
  options: string[];
  activeIndex: number;
  onChange?: (index: number) => void;
}

type ScreenHeaderTitle = string | ScreenHeaderToggleTitle;

function isToggleTitle(
  title: ScreenHeaderTitle,
): title is ScreenHeaderToggleTitle {
  return typeof title !== "string";
}

// Figma: 게시판류 화면의 "공지 | 열린피드백" 같은 2단 탭 타이틀(nodeId 1256:81792 "Board Title").
// 활성 옵션은 Label/Strong(검정), 비활성은 Label/Disable(흐림) — 둘 다 같은 Title 3/Bold(24px).
function ScreenHeaderToggleTitle({
  options,
  activeIndex,
  onChange,
}: ScreenHeaderToggleTitle) {
  return (
    <div className="flex items-center gap-2">
      {options.map((option, index) => {
        const active = index === activeIndex;
        return (
          <button key={option} onClick={() => onChange?.(index)} type="button">
            <Typography
              color={
                active ? "semantic.label.strong" : "semantic.label.disable"
              }
              variant="title3"
              weight="bold"
            >
              {option}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}

type ScreenHeaderProps =
  | {
      variant?: "display";
      title?: ScreenHeaderTitle;
      trailing?: ReactNode;
      toolbar?: ReactNode;
    }
  | {
      variant: "normal";
      title?: ScreenHeaderTitle;
      leading?: ReactNode;
      trailing?: ReactNode;
      toolbar?: ReactNode;
    };

// Figma: Top Navigation/Resource/Contents — 화면마다 따로 조립하던 헤더를 여기 하나로 모았다.
// WDS `TopNavigation`을 감싸는 얇은 조합 레이어일 뿐, 내부 스타일은 오버라이드하지 않는다
// (component-convention.md "WDS 컴포넌트 내부를 임의로 오버라이드하지 않는다").
//
// variant="display"(기본값)에서는 leading을 받지 않는다 — WDS 쪽 스타일 자체가 display일 때
// leading/trailing 포지셔닝(topNavigationLeftIconStyle/RightIconStyle)을 안 줘서 레이아웃이
// 깨진다. leading이 필요한 화면(뒤로가기·닫기 버튼 등)은 variant="normal"을 쓴다.
//
// title이 문자열이면 그대로 렌더링하고, { options, activeIndex } 형태(활성 상태가 있는 경우)면
// 게시판류의 토글형 2단 타이틀로 렌더링한다.
//
// search variant(타이틀 자리가 검색 필드로 바뀌는 패턴)는 이번 범위에서 뺐다 —
// docs/plans/unified-screen-header.md 참고. 화면이 실제로 생기면 그때 추가한다.
//
// toolbar는 WDS `TopNavigation`의 "Area attached below the navigation" 슬롯을 그대로 노출한 것이다.
// Figma의 Top Navigation/Resource/Contents 인스턴스가 타이틀 행 아래에 세그먼트 토글(행사/신청내역 등)을
// 품고 높이 88px이 되는 패턴이 여기 대응한다 — 화면 본문에 토글을 두면 헤더 고정 영역 밖이라
// 스크롤 경계가 화면마다 달라진다.
function ScreenHeader(props: ScreenHeaderProps) {
  const { title, toolbar, trailing } = props;
  const leading = props.variant === "normal" ? props.leading : undefined;

  return (
    <TopNavigation
      background={false}
      leadingContent={leading}
      toolbar={toolbar}
      trailingContent={trailing}
      variant={props.variant ?? "display"}
    >
      {title !== undefined &&
        (isToggleTitle(title) ? <ScreenHeaderToggleTitle {...title} /> : title)}
    </TopNavigation>
  );
}

export default ScreenHeader;
