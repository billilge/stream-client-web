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
    }
  | {
      variant: "normal";
      title?: ScreenHeaderTitle;
      leading?: ReactNode;
      trailing?: ReactNode;
    };

// variant="display"(기본값, 빌릴게/홈)는 더 이상 WDS `Top Navigation/Resource/Contents`가 아니다 —
// Figma가 별도 Stream 로컬 컴포넌트(nodeId 1765:71193 "Top Navigation")로 바뀌었다: 세로 패딩
// 12px(기존 WDS display variant는 16px 고정이라 오버라이드 불가) + Title 3/Bold(32px)가 정확히
// 들어가서 총 56px. leading은 이 패턴에서 쓴 적이 없어 그대로 받지 않는다.
//
// variant="normal"(모달형 닫기 버튼 등, leading 필요)은 아직 WDS `TopNavigation`을 그대로 쓴다 —
// Figma 쪽 해당 패턴은 안 바뀌었다(component-convention.md "WDS 컴포넌트 내부를 임의로
// 오버라이드하지 않는다" 원칙 유지).
//
// title이 문자열이면 그대로 렌더링하고, { options, activeIndex } 형태(활성 상태가 있는 경우)면
// 게시판류의 토글형 2단 타이틀로 렌더링한다.
//
// search variant(타이틀 자리가 검색 필드로 바뀌는 패턴)는 이번 범위에서 뺐다 —
// docs/plans/unified-screen-header.md 참고. 화면이 실제로 생기면 그때 추가한다.
function ScreenHeader(props: ScreenHeaderProps) {
  const { title, trailing } = props;

  if (props.variant === "normal") {
    return (
      <TopNavigation
        background={false}
        leadingContent={props.leading}
        trailingContent={trailing}
        variant="normal"
      >
        {title !== undefined &&
          (isToggleTitle(title) ? (
            <ScreenHeaderToggleTitle {...title} />
          ) : (
            title
          ))}
      </TopNavigation>
    );
  }

  return (
    <div className="flex w-full items-center justify-between px-5 py-3">
      <div className="flex min-w-0 items-center">
        {title !== undefined &&
          (isToggleTitle(title) ? (
            <ScreenHeaderToggleTitle {...title} />
          ) : (
            <Typography
              as="h2"
              color="semantic.label.strong"
              variant="title3"
              weight="bold"
            >
              {title}
            </Typography>
          ))}
      </div>
      {trailing !== undefined && (
        <div className="flex shrink-0 items-center gap-4">{trailing}</div>
      )}
    </div>
  );
}

export default ScreenHeader;
