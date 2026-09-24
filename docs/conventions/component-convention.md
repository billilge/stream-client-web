# Component Convention

> Figma 디자인을 코드 컴포넌트로 옮길 때 따르는 구조 규칙.
> `docs/conventions/coding-style.md`(네이밍·폴더·TS 규칙)를 보완하는 문서이며, `/component` 스킬이 만드는 모든 컴포넌트는 이 규칙을 따른다.

## 0. 원칙

Figma에 있는 요소라고 전부 새로 코드를 짜지 않는다.

- **WDS(원티드 디자인 시스템) 컴포넌트로 확인된 건 반드시 `@wanteddev/wds`/`@wanteddev/wds-icon`을 import해서 쓴다.** 직접 마크업을 새로 짜지 않는다. 판별 기준은 `docs/conventions/wds-component-usage.md`.
- **Stream 고유 UI만 새 컴포넌트로 만든다** — WDS에 없는, Stream 서비스에서만 쓰는 화면 조각(카드, 리스트 아이템 등).

## 1. 파일 위치

`coding-style.md`의 기능 기반(feature-based) 구조를 따른다.

- 지금 다루는 화면/기능 전용이면 `features/<기능>/components/<ComponentName>.tsx`
- 이미 다른 화면에서도 쓰이는 게 Figma 상에서 확인되면 `components/ui/<ComponentName>.tsx`
- **애매하면 먼저 `features/` 아래에 둔다.** 두 번째 화면에서 실제로 재사용될 때 `components/ui/`로 옮긴다 — 성급하게 공용 폴더부터 만들지 않는다(coding-style.md의 "빈 폴더 미리 만들지 않는다"와 같은 이유).

## 2. 파일 구조

- **컴포넌트 하나 = 파일 하나** (`ComponentName.tsx`). 폴더로 쪼개지 않는다 — 실제로 서브컴포넌트가 분리될 필요가 생기면 그때 판단한다.
- Figma의 variant(예: `trailingControl: Button | Stepper`)는 **Props의 유니온 타입 하나로 매핑**한다. variant 조합마다 별도 컴포넌트를 만들지 않는다.
- Props는 `interface`로 선언한다(coding-style.md TypeScript 규칙).

```tsx
interface RentalItemCardProps {
  itemName: string
  quantity: number
  trailingControl?: 'button' | 'stepper'
}
```

## 3. WDS 컴포넌트 사용

- 매칭된 서브트리는 `get_design_context`가 준 raw JSX 대신 **실제 WDS export로 치환**한다.
- export 이름은 반드시 `node_modules/@wanteddev/wds/dist/components/`에서 확인 후 쓴다 — 이름을 추측하지 않는다.
  - 예: Figma `Button/Button` → `import { Button } from '@wanteddev/wds'`
  - 예: Figma `Chip/Chip` → `import { Chip } from '@wanteddev/wds'`
- 아이콘은 `@wanteddev/wds-icon`에서 가져온다.
- **WDS 컴포넌트 내부를 임의로 오버라이드하지 않는다.** 간격·배치 같은 레이아웃 조정은 감싸는 wrapper에서 한다.
- **화면 헤더는 화면에서 `TopNavigation`을 직접 새로 조립하지 않고 `src/components/ui/ScreenHeader.tsx`를 거친다.** Figma의 Top Navigation 패턴(타이틀 정렬, leading/trailing 조합, 게시판류의 토글형 타이틀 등)을 `ScreenHeader`의 props(`variant`/`title`/`leading`/`trailing`)로 고르게 돼 있다 — 화면마다 손으로 다시 조립하면 컨벤션이 흩어진다. 새 헤더 패턴이 필요하면 `ScreenHeader`부터 확장한다(`docs/plans/unified-screen-header.md` 참고).

## 4. Stream 고유 UI (신규 컴포넌트)

- `get_design_context`의 raw JSX/Tailwind는 **레퍼런스일 뿐, 그대로 커밋하지 않는다.** 프로젝트 Tailwind 클래스로 다시 짜되, 색상은 아래 "색상 토큰" 규칙을 따른다.

### 색상 토큰

- 색은 `text-[#171719]`처럼 hex를 직접 박지 않는다. `src/index.css`의 `@theme` 블록에 있는 시맨틱 토큰(`text-label-normal`, `bg-background-alternative`, `border-line-solid-neutral`, `text-primary`, `bg-primary-subtle` 등)을 쓴다. 이 토큰들은 `@wanteddev/wds/global.css`가 심어둔 `--semantic-*`/`--atomic-*` CSS 변수를 그대로 별칭 연결한 것이라 다크 테마 전환도 자동으로 따라간다.
- 필요한 색이 아직 토큰으로 없으면, hex를 추측해서 쓰지 말고 `get_variable_defs(fileKey, nodeId)`로 해당 노드의 실제 Figma 변수명·값을 확인한 뒤 `index.css`의 `@theme`에 새 토큰을 추가한다. `Line/Normal/Neutral`(반투명 `#70737c29`)과 `Line/Solid/Neutral`(불투명 `#eaebec`)처럼 이름이 비슷해도 값이 다른 토큰이 있으니 이름만 보고 넘겨짚지 않는다.
- 컴포넌트 인스턴스가 없는 화면 배경/외곽선처럼 Figma 값이 실제로는 안 보이는 경우(예: Bottom Nav 상단 border가 바로 위 배경과 같은 색이라 안 보였던 사례)도 있다 — 이럴 땐 왜 다른 토큰으로 바꿨는지 주석으로 남긴다.
### 타이포그래피

- 글자 크기·굵기를 `text-xs`/`text-[17px]`/`font-semibold`처럼 Tailwind로 직접 짓지 않는다. `@wanteddev/wds`의 `Typography` 컴포넌트를 쓴다 — Figma의 이름 있는 타입 스타일(Headline 2/Bold 등)과 `variant`+`weight` 조합이 1:1로 대응한다(`node_modules/@wanteddev/wds/dist/components/typography/style.js`에서 실측 확인 가능).
- Tailwind에는 11px(Caption 2) 같은 값이 기본 스케일에 없어서, 대충 가까운 `text-xs`(12px)를 썼다가 실제로 다른 크기가 되는 사고가 실제로 있었다(Bottom Nav 탭 라벨). `Typography`를 쓰면 이 스케일 자체가 WDS 값이라 이런 어긋남이 구조적으로 없어진다.
- 색은 `className`의 Tailwind 색상 토큰이 아니라 `Typography`의 `color` prop(예: `color="semantic.label.normal"`)으로 준다. `Typography`가 `color` 미지정 시 `color: inherit`을 자체 CSS-in-JS로 주입하는데, 이 스타일이 Tailwind 유틸리티 레이어보다 우선순위가 높아서(`@wanteddev/wds/global.css`를 `layer(base)`로 감싸야 했던 것과 같은 이유) `className="text-label-normal"`을 같이 줘도 씹힐 수 있다.
- `variant`/`weight` → Figma 이름 대응표(자주 쓰는 것만):

  | `variant` | `weight` | 실제 크기 | Figma 이름 |
  |---|---|---|---|
  | `headline1` | `bold` | 18px / SemiBold | Headline 1/Bold |
  | `headline2` | `bold` | 17px / SemiBold | Headline 2/Bold |
  | `headline2` | `medium` | 17px / Medium | Headline 2/Medium |
  | `label1` | `bold` | 14px / SemiBold | Label 1/Normal - Bold |
  | `caption1` | `bold` | 12px / SemiBold | Caption 1/Bold |
  | `caption1` | `medium` | 12px / Medium | Caption 1/Medium |
  | `caption1` | `regular` | 12px / Regular | Caption 1/Regular |
  | `caption2` | `medium` | 11px / Medium | Caption 2/Medium |

- **예외**: 서드파티 라이브러리가 `className` 문자열만 받아서 자기 DOM에 그대로 꽂는 자리(예: `@ncdai/react-wheel-picker`의 `classNames` prop)는 `Typography`로 감쌀 수 없다 — 이럴 땐 Tailwind `text-[17px]` 같은 값을 그대로 쓰되, 어느 Figma 타입 스타일을 옮긴 값인지 주석을 남긴다(`BililgeRentalSheet.tsx`의 `WHEEL_CLASS_NAMES` 참고).

- Stream 자체 이미지·아이콘(일러스트, 물품 아이콘 등)은 `download_assets`로 받아 `src/assets/`에 커밋한다. Figma asset URL은 **7일 후 만료**되므로 절대 코드에 그대로 참조하지 않는다.

### 모션 (Lottie)

Figma Motion(키프레임 타임라인)이 붙은 요소는 키프레임을 손으로 옮기지 않고 **Lottie로 받아 재생한다**. 디자이너가 모션을 고치면 json만 다시 받으면 되기 때문이다. 손으로 옮기면 `times`·이징 값이 코드에 흩어져서 수정 때마다 같은 노동이 반복된다(행사 제출 중·완료 모션이 실제로 그랬다).

- **export**: Figma Dev mode에는 Lottie export가 없다. LottieFiles 플러그인에서 **키프레임이 붙은 프레임을 선택**하고 Export 탭 → Preview 확인 후 json으로 받는다. 화면 전체 프레임이 아니라 모션 프레임을 골라야 한다(예: `행사 로딩 1133:43453`이 아니라 `Loading / Document Review 1133:44260`).
  - hidden 레이어와 boolean 연산(union/intersect/exclude)은 export에서 빠진다. Preview에 안 보이면 이걸 먼저 의심한다.
- **파일 위치**: `src/assets/lottie/<기능>/<이름>.json`. 이미지·아이콘과 같은 이유로 저장소에 커밋한다.
- **컴포넌트**: `lottie-react`의 **`LottieLight`**를 쓴다. `Lottie`(풀 빌드)는 canvas·HTML 렌더러와 `eval` 기반 표현식 엔진까지 끌고 와서 번들이 224KB(gzip 43KB) 커지고, 출하 번들에 `eval`이 남아 WebView CSP에서 깨질 수 있다. Figma에서 나온 Lottie는 표현식을 쓰지 않으므로 SVG 렌더러만 있으면 된다.
- **문구는 Lottie에 넣지 않는다**: export 원본에 텍스트가 포함돼 있으면 그 레이어를 빼고 컴포지션을 일러스트 경계로 자른 뒤, 문구는 `Typography`로 따로 그린다. Lottie 안의 텍스트는 벡터 도형이라 스크린리더가 못 읽고 타이포 토큰도 안 따라간다. **어떤 레이어를 왜 뺐는지와 잘라낸 크기를 컴포넌트 주석에 남긴다** — 재export 때 같은 가공을 다시 해야 한다.
- **모션 줄이기**: `usePrefersReducedMotion()`으로 판단해 `autoplay={false}` + `segment={[n, n + 1]}`로 다 그려진 프레임 한 장만 세운다. `autoplay`를 켠 채로 두면 lottie-react가 알아서 막긴 하지만 개발 콘솔에 경고를 남기므로 우리가 먼저 끈다. CSS transition으로 끌 수 있는 자리(`ConfirmModal` 등)는 Tailwind `motion-reduce:` 변형을 그대로 쓴다.
- **포매팅 제외**: `biome.jsonc`의 `files.includes`에서 `!**/src/assets/lottie`로 뺀다. 사람이 고치는 파일이 아니고, 빼지 않으면 재export할 때마다 포맷 diff가 터진다.
- **색상 토큰 예외**: Lottie는 색을 json 안에 굽기 때문에 위 "색상 토큰" 규칙(다크 테마 자동 추종)이 적용되지 않는다. Lottie를 쓰기로 한 이상 피할 수 없는 트레이드오프다 — 다크 테마를 도입하면 Lottie 모션은 따로 손봐야 한다.
- `data-node-id` 같은 Figma 추적용 속성은 컴포넌트 마크업에 남기지 않는다. 대신 파일 최상단에 원본 Figma 노드를 알 수 있는 주석 한 줄만 남긴다 — 나중에 디자인이 바뀌었을 때 다시 대조할 수 있도록:

```tsx
// Figma: Rental Item Card (nodeId 1041:61407)
```

## 5. 완료 기준 체크리스트

- [ ] WDS로 확인된 요소는 전부 import로 대체했다 (raw JSX 없음)
- [ ] 텍스트는 `Typography`(`variant`+`weight`)로 썼다 — 서드파티가 className만 받는 자리가 아닌 이상 `text-xs`/`text-[Npx]` 직접 사용 없음
- [ ] Stream 고유 요소만 새 컴포넌트로 작성했다
- [ ] Props가 Figma variant를 유니온 타입으로 반영한다
- [ ] 이미지/아이콘 asset을 다운로드해 커밋했다 (만료되는 Figma URL 미참조)
- [ ] 파일 위치가 재사용 범위(feature 전용 vs 공용)에 맞는다
- [ ] `pnpm check`(Biome) 통과
