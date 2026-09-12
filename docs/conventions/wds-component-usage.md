# Figma Stream 파일 — WDS(원티드 디자인 시스템) 사용 현황

> 작성일: 2026-09-07
> 종류: 살아있는 참고 문서 — `/component` 스킬이 매번 이 문서부터 대조하고, 새로 확정되는 매핑을 여기에 추가한다
> 대상 파일: [🌊 Stream](https://www.figma.com/design/3QkxTuGLZkB17pZILTog9L/%F0%9F%8C%8A--Stream) (`fileKey: 3QkxTuGLZkB17pZILTog9L`)

## 배경

`4. 사용자 UI` 페이지(`nodeId: 971:29755`) 안에 있는 `component`라는 이름의 섹션(`nodeId: 985:36615`)은 Stream 팀이 자체적으로 만든 화면 조각(로컬 심볼) 모음이며, WDS 컴포넌트가 아니다. 실제 WDS 컴포넌트는 각 화면 인스턴스 안에 흩어져서 쓰이고 있어, 파일 전체 메타데이터에서 인스턴스 이름을 모아 [Wanted Design System (Community)](https://www.figma.com) 라이브러리(`libraryKey: lk-01f447137a741b37c25896e9a4e109dcb719fa4e54177be9a39d24b8da507c109279c2d1d0533b9943595d7d6a5ea398977f43b5d84e163797965d810ba79b69`)의 `search_design_system` 검색 결과와 이름을 대조해 정리했다.

## 조사 방법 및 한계

1. `get_libraries`로 Stream 파일에 연결된 라이브러리 확인 → WDS(Community), iOS and iPadOS 26 2개가 연결됨.
2. `get_metadata(971:29755)`로 페이지 전체 노드 트리(약 43만자)를 받아 로컬 파일로 저장.
3. 저장된 트리에서 `<instance ...>` 태그만 추출해 이름별로 집계(총 178개 고유 이름, 인스턴스 총 개수 기준).
4. 각 이름을 `search_design_system`(WDS 라이브러리로 스코프 제한)에 검색해 **정확히 같은 이름의 컴포넌트가 WDS에 존재하는지** 대조.

**한계**: `get_metadata`는 인스턴스의 `componentKey`(어느 라이브러리 컴포넌트를 참조하는지 나타내는 고유 키)를 주지 않는다. 그래서 아래 표는 "이름 일치"로 확인한 것이며, 100% 확정하려면 `get_design_context`로 각 인스턴스를 열어 componentKey를 대조해야 한다(아래 "완전 확정 방법" 참고).

## WDS 컴포넌트로 확인됨 (이름 정확히 일치, componentKey까지 확보)

| WDS 컴포넌트 | 파일 내 인스턴스 수 | WDS componentKey |
|---|---|---|
| `Top Navigation/Resource/Contents` | 81 | `fcafe72bb0d975a6a1e6486be86be899e7d93e4a` |
| `Content Badge/Content Badge` | 48 | `2118b972d3ea08f35fb551cc755e41b5adeeb312` |
| `Control/Checkbox` | 42 | `72378cce3669fd4c065f12d01c254c303209d700` |
| `Action Area/Action Area` | 34 | `56b315679e172ceeac7ad64851cb0059ec235ae7` |
| `Control/Radio` | 28 | `8267d231338418aa74450dcfbe1576791540fb2a` |
| `Textinput/Textarea` | 24 | 메인 컴포넌트 Node ID `567:14111` — [문서](https://montage.wanted.co.kr/docs/components/selection-and-input/text-area/design) |
| `Chip/Chip` | 24 | 메인 컴포넌트 Node ID `440:4251` — [문서](https://montage.wanted.co.kr/docs/components/actions/action-chip/design) |
| `Icon/Normal/Location` | 13 | 메인 컴포넌트 Node ID `567:16585` |
| `Icon/Normal/Clock` | 13 | `7b620e5b46b1a467c6f8662fabcde63ce4e73b01` |
| `Page Indicator/Counter` | 12 | `560362b1ebe2ebe05646e66f4eb54a1531f3073d` |
| `Toast/Toast` | 10 | `5e6b6b522ae500ca6cd893ee2c2ffaf378c5c808` |
| `Button/Button` | 9 | `d28f3e22ae96d34ce26fb02977f23fb8084b7f85` |
| `Menu/Resource/Action Area/Trailing Content/Button` | 7 | `b7088257913aa98cea946cc3dc7931ebd544b872` |
| `Divider/Divider` | 7 | `cdef3da5cdbdd1e6f5d5d9efe85280c509b9e614` |
| `Icon/Normal/Circle Info` | 6 | 메인 컴포넌트 Node ID `440:4076` |
| `Icon/Normal/Arrow Right` | 6 | `26812c6481c960486eebf2282d6e12f2d4a133cd` |
| `Tab/Tab` | 4 | `454aa29664579ce983621c8b1c078f3e2e7ddbb0` |
| `Pagination/Dots` | 4 | 메인 컴포넌트 Node ID `445:9563` — [문서](https://montage.wanted.co.kr/docs/components/navigations/pagination-dots/design) |
| `Avatar` (Avatar/Avatar 계열) | 4 | `5885add30e5c5f5048057425d06ee89f263e96dd` |
| `Icon/Normal/Circle Check` | 3 | `bd9f80c38233b8d368cbcb4b8b9dcfa4c14c10b5` |
| `Menu/Menu` | 3 | `b4044d0a6a54bc6f8b10a76b97bfdf46a3978098` |
| `Icon/Normal/Plus` | 2 | `c2b078d8027a89ac207d6f5a1fe4205f9e26242c` |
| `Icon/Normal/Pencil` | 2 | `ddc90ae1926c0277477f233629cd4c186e87426f` |
| `Category/Resource/Chip/Normal/Normal` | 2 | `7a1668f2266cd57a689731ded85b52aa58c39905` |
| `Category/Resource/Chip/Normal/XSmall` | 1 | `73e0f352cd9ac759377854340136cd1f1032b6cb` |
| `Category/Resource/Chip/Alternative/Small` | 1 | `72cee86994b3c3581887be5149c41a59c4b02d93` |
| `Icon/Normal/Calendar` | 1 | `e050124e28e6217eedf243295b6087728acd9edc` |

WDS 컴포넌트만 합산하면 파일 안에서 **약 350회 이상**의 인스턴스가 확인된다(위 표 합계 기준). `Textinput/Textarea`, `Chip/Chip`, `Icon/Normal/Location`, `Icon/Normal/Circle Info`, `Pagination/Dots` 5개는 `get_design_context`로 실제 노드를 열어 WDS 메인 컴포넌트 Node ID(및 3개는 원티드 공식 디자인 시스템 문서 링크)까지 확인해 완전히 확정했다.

## 이후 세션에서 개별 화면 작업 중 추가 확인된 매핑

파일 전체 스캔이 아니라 `/component`로 특정 화면(빌릴게, `1243:73331`)을 구현하면서 `get_design_context`로 열어본 김에 확정한 것들. 인스턴스 수는 파일 전체 기준이 아니라 "이 화면에서 확인됨"이다.

| WDS 컴포넌트 | 확인 경로 | WDS 메인 컴포넌트 Node ID / 문서 |
|---|---|---|
| `Segmented Control/Segmented Control` | 빌릴게 화면 Top Navigation 안 "대여/반납" 토글 | `500:11592` — [문서](https://montage.wanted.co.kr/docs/components/selection-and-input/segmented-control/design) |
| `Icon/Normal/Search` | 빌릴게 화면 Top Navigation 트레일링 아이콘 | `445:5904` |
| `Icon/Normal/Bell` | 빌릴게 화면 Top Navigation 트레일링 아이콘 | `445:13236` |
| `Icon/Normal/Home` | Bottom Nav "홈" 탭(Normal 상태) | `980:35475` |
| `Icon/Normal/Ticket` | Bottom Nav "행사" 탭(Normal 상태) | `980:35529` |
| `Icon/Normal/List` | Bottom Nav "게시판" 탭(Normal 상태) | `980:35703` |

코드에서는 `@wanteddev/wds-icon`의 `IconSearch`/`IconBell`/`IconHome`/`IconTicket`/`IconList`로 대응된다(각각 default export를 `index.d.ts`에서 named export로 재노출). `Segmented Control`은 `@wanteddev/wds`의 `SegmentedControl`/`SegmentedControlItem`으로 대응된다.

### `Typography` — 텍스트 스타일은 Figma 인스턴스 스캔에 안 잡혀서 뒤늦게 확인됨

위 표들은 Figma의 인스턴스(컴포넌트) 이름을 스캔해서 만든 거라, Figma에서 텍스트 스타일(Text Style)로만 적용되고 별도 컴포넌트 인스턴스가 아닌 타이포그래피는 이 방식으로는 안 잡힌다. 그래서 지금까지 `text-xs`/`text-[17px]` 같은 Tailwind 값을 화면마다 손으로 맞춰왔는데, `@wanteddev/wds`에 Figma의 이름 있는 타입 스타일(Headline 2/Bold 등)과 정확히 대응하는 `Typography` 컴포넌트가 있다는 걸 뒤늦게 확인했다(`node_modules/@wanteddev/wds/dist/components/typography/style.js`). Bottom Nav 탭 라벨을 `text-xs`(12px)로 잘못 만들었던 것도 실제 Figma 값(Caption 2/Medium, 11px)과 어긋난 채로 남아있다가 이번에 확인됐다.

`variant`+`weight` 조합과 색상 `color` prop 사용법은 `docs/conventions/component-convention.md`의 "타이포그래피" 절 참고. 이후 새 화면을 만들 때는 텍스트 크기를 짐작하지 말고 이 컴포넌트부터 확인한다.

### 반례 — 빌릴게 필터 Chip은 WDS `Chip/Chip`이 아니었다

위 "WDS 컴포넌트로 확인됨" 표에 `Chip/Chip`이 파일 전체 기준 24개 인스턴스로 확정돼 있다고 해서, **다른 화면의 비슷하게 생긴 칩도 자동으로 WDS라고 가정하면 안 된다.** 빌릴게 화면의 카테고리 필터(전체/전자기기/생활잡화/상비약/위생용품)를 처음 구현할 때 이 표만 보고 재조사 없이 WDS `Chip`을 그대로 썼는데, 실제 Figma 스타일(활성 = 연한 파랑 배경 + 파랑 outline, 비활성 = 회색 outline)이 WDS Chip의 기본 활성 스타일(검정 배경)과 달랐다 — Stream이 로컬로 새로 만든 칩이었다. **스타일이 눈에 띄게 다르면, 이름이 같아 보여도 그 인스턴스는 따로 `get_design_context`로 열어 확인한다.** 코드는 `src/features/rental/components/RentalCategoryFilter.tsx` 참고 (plain `<button>` 기반, WDS import 없음).

### Bottom Nav — 구현 시점 판단 결과 (WDS `BottomNavigation` 시도 → 철회)

54번째 줄 아래 "제외됨" 표의 `Bottom Nav` 항목에 "실제 구현 시에는 WDS 코드 컴포넌트를 기반으로 만드는 게 나을 수 있다 — 구현 단계에서 판단"이라고 남겨뒀던 것을, 빌릴게 화면을 처음 조립할 때는 `@wanteddev/wds`의 `BottomNavigation`/`BottomNavigationItem`을 그대로 썼다. **그런데 실제로 써보니 문제가 있었다**: `BottomNavigation`은 기본적으로 iOS 스타일 반투명 배경(`theme.semantic.platform.ios.navigation`)을 쓰고, 게다가 `document.body` 기준 스크롤이 끝에 도달했는지를 감지해서 배경을 아예 투명하게 바꾸는 로직까지 내장돼 있다(`bottom-navigation/style.js`의 `&[data-scroll-end='true']`). 우리 화면은 body가 아니라 헤더/푸터 사이 안쪽 div만 스크롤되는 구조라서 이 감지가 항상 "스크롤 끝"으로 오판했고, `sx`로 배경을 덮어써도 그 규칙의 특이성(attribute selector)이 더 높아서 안 먹혔다.

그래서 **Bottom Nav는 원래 결론(Stream 로컬 컴포넌트)대로 되돌려 `src/components/ui/BottomNav.tsx`를 새로 만들었다.** Figma의 `Bottom Nav` 공통 컴포넌트(`985:39948`, `Selected=Home/Event/Board/Rental` variant)를 `/component`로 다시 열어 확인:
- 비선택(Normal) 상태 아이콘은 4개 다 WDS로 확인됨: `Icon/Normal/Home`, `Icon/Normal/Ticket`, `Icon/Normal/List`(위 표 참고) + `Icon/Normal/Storage`(`980:35839`, 코드 export `IconStorage` — 원래 설명은 "AI 이전 대화 기록 보관함"이지만 글리프가 보관함/사물함 모양이라 빌릴게 탭에 그대로 재사용)
- 선택(Selected) 상태 아이콘 4개는 전부 Figma에서 내려받은 컬러 아이콘(`src/assets/icons/bottom-nav/{home,event,board,rental}-selected.svg`)을 쓴다. `IconHomeFill`/`IconTicketFill`은 `@wanteddev/wds-icon`에 존재하지만 게시판(List)에는 대응하는 Fill 아이콘이 없어서, 4개 전부 통일해서 실제 에셋을 쓰는 쪽을 택했다(하나만 WDS 아이콘 쓰고 나머지 셋만 에셋 쓰면 방식이 갈려서 더 헷갈림).

### `Menu/Resource/Action Area/Trailing Content/Button` — 코드 export가 없어서 `Button` + `sx` 보정으로 대체

위 표에서 componentKey까지 확정된 `Menu/Resource/Action Area/Trailing Content/Button`(빌릴게 카드의 "대여 신청" 버튼)은 `@wanteddev/wds`에 1:1 대응하는 export가 없다. `search_design_system`으로 찾아보면 `Menu/Resource/Action Area/*`가 `Leading Content/Icon`·`Leading Content/Badge`·`Trailing Content/Button`·`Trailing Content/Badge`·`Trailing Content/Icon Button` 등으로 Figma에서만 슬롯별로 잘게 쪼갠 구성 컴포넌트들이라, 코드 쪽엔 이런 이름의 컴포넌트가 따로 없다(리스트 행 컴포넌트인 `ListCell`/`ListCellContent`의 `variant="button"`도 열어봤지만 자체 배경색을 안 입혀서 매칭 안 됨).

대신 `@wanteddev/wds`의 `Button`을 직접 열어보니(`node_modules/@wanteddev/wds/dist/components/button/style.js`) `size="small"`이 padding(`7px 14px`)·`border-radius: 8px`·타이포(`label2`)까지 Figma 스펙과 정확히 일치했다. 다만 `Button`의 공개 variant(`variant: 'solid'|'outlined'` × `color: 'primary'|'assistive'` 4가지 조합)엔 이 버튼의 "옅은 파랑 배경(`#EAF2FE`) + 파랑 텍스트(`#0066FF`)" 조합이 없어서, 그 두 색상만 `sx`로 덮어썼다:

```tsx
<Button color="primary" size="small" variant="solid"
  sx={{ backgroundColor: "var(--color-primary-subtle)", color: "var(--color-primary)" }}>
  대여 신청
</Button>
```

hex를 하드코딩하지 않고 `index.css`의 색상 토큰을 그대로 참조했고, `Button` 자체(접근성 속성, `disabled`/`loading` 상태 처리 등)는 그대로 재사용한다. `src/features/bililge/components/BililgeItemCard.tsx` 참고.

### 빌릴게 대여 바텀시트 — `Action Area/Action Area`, `Icon/Normal/Circle Info`, 그리고 Time Picker는 의도적으로 WDS를 안 씀

`/component`로 빌릴게 대여 바텀시트(Figma nodeId `1422:57155`, 실제 시트 콘텐츠는 `1422:57176`)를 구현하며 확인된 내용.

- **`Action Area/Action Area` + `ActionAreaButton`**: 버튼 하나(대여 신청하기)만 있는 액션 영역도 `@wanteddev/wds`의 `ActionArea`(기본 `variant="strong"`) + `ActionAreaButton`(기본 `variant="main"`)으로 그대로 재현된다. `ActionAreaButton`의 `main` variant가 내부적으로 `Button`을 `size="large"` `fullWidth` `variant="solid"` `color="primary"`로 렌더링해서 Figma의 파란 통 너비 버튼과 정확히 일치했다(`node_modules/@wanteddev/wds/dist/components/action-area/index.js` 확인). `src/features/bililge/components/BililgeRentalSheet.tsx` 참고.
- **`Icon/Normal/Circle Info`**: 안내 문구("대여 시작 시간은 최소 5분 뒤부터...") 앞 아이콘. 위 표에서 이미 확정된 매핑 재사용(`@wanteddev/wds-icon`의 `IconCircleInfo`).
- **Time Picker(휠 피커)는 예외적으로 WDS를 쓰지 않기로 결정했다.** `@wanteddev/wds`에 `time-picker` 컴포넌트가 실제로 존재하지만(`node_modules/@wanteddev/wds/dist/components/time-picker/`), 이건 `<input>` 기반 텍스트 필드형 컴포넌트라 Figma가 그리는 iOS 스타일 휠 스크롤 피커(오전/오후·시·분 3열, 가운데 값만 진하게)와는 UI 패턴 자체가 다르다. 사용자가 명시적으로 지정한 [`@ncdai/react-wheel-picker`](https://react-wheel-picker.chanhdai.com)(unstyled core, `WheelPicker`/`WheelPickerWrapper`)로 구현했다:
  - `optionItem`/`highlightItem`/`highlightWrapper` classNames로 텍스트 스타일만 입히고(선택 안 됨: `text-label-disable` 17px medium, 선택됨: `text-label-normal` 18px semibold), Figma의 "Selection Highlight"(3열을 가로지르는 pill 배경, `bg-background-alternative`)는 라이브러리 밖에서 별도 `absolute` div로 얹었다 — 각 컬럼마다 하이라이트 배경을 따로 안 그리기 위해서다.
  - 이 라이브러리의 CSS(`@ncdai/react-wheel-picker/style.css`)도 `@wanteddev/wds/global.css`와 같은 이유로 **반드시 `layer(base)`로 import해야 한다**(`src/index.css`) — 안 그러면 Tailwind 유틸리티가 라이브러리의 unlayered CSS한테 밀려서 `justify-center` 같은 오버라이드가 안 먹는다.
  - 새 토큰 `--color-label-disable`(`--semantic-label-disable` 별칭)을 이때 추가했다. `get_variable_defs`로 확인한 실제 값은 `rgba(55,56,60,0.16)`.

### 행사 신청 폼 — `Control/Checkbox`, `Control/Radio`, `Textinput/Textarea`, `Action Area`, 그리고 문항 제목은 WDS `Label`이 아님

`/component`로 행사 신청서 작성 화면(Figma nodeId `1133:42457`, #25)을 구현하며 확인된 내용. 코드는 `src/features/events/` 참고.

- **`Control/Checkbox` → `Checkbox`, `Control/Radio` → `RadioGroup` + `RadioGroupItem`**: Figma 인스턴스는 `Size=Small`이라 `size="small"`로 쓴다. 둘 다 label prop이 없고 `<button role="checkbox|radio">`로 렌더링되며 `id`를 그대로 넘겨주므로, 옆에 `<label htmlFor={id}>`를 두면 텍스트를 눌러도 선택된다(`Checkbox`의 `bold` prop도 `~ label` 형제 요소를 대상으로 동작하는 구조). `RadioGroup` 루트 스타일에 기대지 않도록 선택지 간격(12px)은 안쪽 wrapper div에서 준다.
- **`Textinput/Textarea` → `TextArea` + `TextAreaContent variant="characterCounter"`**: 카운터는 `children`으로 준 숫자를 최대값으로 쓰고 현재 길이는 TextArea context에서 읽는다(`<TextAreaContent variant="characterCounter">{500}</TextAreaContent>` → `0/500`). `maxLength`는 네이티브 textarea로 그대로 전달돼 실제 입력이 막힌다. 주의할 기본값 두 가지:
  - `minRows` 기본값이 2라 Figma 기본 높이(한 줄, 76px)와 맞추려면 `minRows={1}`. 입력이 늘면 자동으로 칸이 커진다(디자이너 메모 "자동으로 칸이 늘어남"과 일치).
  - `width` 기본값이 부모 폭을 채우지 않는다 — 안 주면 카드 폭의 절반 정도로 렌더링돼서 `width="100%"`를 줬다.
  - 높이 계산용 숨김 textarea(`readonly`, `aria-hidden`)를 하나 더 렌더링한다 — 테스트·자동화에서 `textarea` 셀렉터를 쓸 때 제외해야 한다.
  - 단답형(50자)도 같은 `TextArea`를 쓴다(Figma 텍스트 입력 예시 `1133:43105`의 디자이너 메모).
- **`Action Area/Action Area` → `ActionArea background` + `ActionAreaButton`**: `background`를 켜면 `::before`가 영역 위로 `margin-y`(20px)만큼 더 올라가 그라데이션 마스크로 스크롤 내용을 흐리게 덮는다(Figma `Gradient/Solid`와 일치). `divider`는 기본값이 `true`지만 `extra` 모드에서만 선을 그려서 일반 모드에는 영향 없다. Figma Action Area(110px = 위 20 + 버튼 56 + 아래 34)는 버튼 아래가 iOS **Bottom Safe Area까지 합쳐 34px**인데 WDS `ActionArea`는 아래 padding 20px만 줘서, 모자란 **14px**을 `bg-background-elevated-normal` div로 따로 붙였다(`BottomSheet`에서 14px을 더한 것과 같은 이유). 처음엔 Safe Area 34px을 통째로 더해서 버튼 아래가 54px로 벌어졌었다 — ActionArea 자체 padding과 겹치는지 먼저 확인한다. 이때 `--color-background-elevated-normal`(`--semantic-background-elevated-normal` 별칭) 토큰을 추가했다.
- **Action Area 메인 버튼 높이**: `ActionAreaButton`(`main`)은 항상 `Button size="large"`(padding `12px 28px` → **48px**)로 그리는데, Figma `┗ Main Action`은 padding `16px 28px`(**56px**)이다. WDS에 56px 크기가 없어서 `sx={{ paddingBlock: "16px" }}`로 세로 padding만 맞췄다(`ActionAreaButton`은 `props.sx`를 내부 `Button` 스타일 맨 뒤에 붙여서 덮어쓰기가 된다). 빌릴게 대여 바텀시트 Figma(`1422:57205`)의 "대여 신청하기" 버튼도 같은 56px 스펙이지만, `BililgeRentalSheet.tsx`는 아직 `sx` 없이 48px로 렌더링된다(위 "빌릴게 대여 바텀시트" 절의 "정확히 일치" 기록은 높이까지는 대조하지 않은 것으로 보인다).
- **기타(직접 입력) 입력칸은 WDS가 아니라 plain `<input>`**: Figma `Other Option`(`1658:183954`)은 체크박스 아래에 밑줄만 있는 입력칸이라, WDS `TextField`(배경·테두리·12px radius가 있는 박스형)와 생김새가 다르다. 밑줄은 `Primary/Normal` 0.7px(에셋 SVG의 stroke로 확인, `get_variable_defs`만으로는 선 색이 안 나온다). `<input>`은 `Typography`로 감쌀 수 없는 자리라 Figma `Label 1/Normal - Regular`(14px) 값을 className에 직접 쓰고 주석을 남겼다(휠 피커와 같은 예외).
- **Top Navigation 뒤로가기**: `TopNavigationButton`에는 back 전용 variant가 없어서(`'text' | 'icon'`) `variant="icon"` + `IconChevronLeft`를 `ScreenHeader variant="normal"`의 `leading`에 넣는다.
- **`Icon/Normal/Clock`, `Icon/Normal/Location`**: 위 표의 기존 매핑 재사용(`IconClock`, `IconLocation`). 색은 `get_variable_defs`로 확인한 `Label/Assistive`(`text-label-assistive`) — 옆 텍스트(`Label/Alternative`)보다 옅다.

#### 반례 — 문항 제목의 필수 `*`는 WDS `Label required`로 대체하지 않았다

WDS `Label`의 `required`는 `*`를 `semantic.status.negative`로 그려서 **색은 Figma(`Status/Negative`, #FF4242)와 같지만**, `*` 크기가 `label1`/medium(14px)으로 고정돼 있어 Figma의 `*`(Body 1/Bold, 16px)와 다르다. 또 Figma의 `Field Label`은 WDS 인스턴스가 아니라 로컬 텍스트 프레임이다. 그래서 문항 제목은 `Typography`(body2/bold) + `*`(`Typography` body1/bold, `color="semantic.status.negative"`)로 직접 조립했다. **색만 보고 WDS 컴포넌트로 판단하지 말고 크기·굵기까지 대조한다.**

## 제외됨 — Stream 자체 로컬 컴포넌트 (WDS 아님)

이름은 비슷해 보여도 WDS 검색 결과에 없거나, `component` 섹션(985:36615)에서 로컬 심볼로 직접 정의된 것들:

- `Rental Item Card`, `RentalHistory-card`, `ApplicationHistory-card`, `Item-card` 계열, `Event-card`, `Q&A Card`, `Notice-card` — Stream 도메인 전용 카드
- `Bottom Nav`, `BottomNav/Icon`, `Locker-button`, `SearchField`, `Floating Button`, `Empty State`, `Modal`, `Modal/ButtonGroup`, `Section-header`, `Top Navigation`(WDS의 `Top Navigation/Resource/Contents`와 다른 별개 로컬 프레임), `divider(new)`, `ProgressBar`, `Native / Home Indicator`, `Native / Bottom Sheet Indicator`
- `Icon/Feedback`, `Icon/Camera`, `Icon/Link`, `Icon/Answer`, `Icon/Activity`, `Icon/Arrow` 및 고데기·알약·후시딘 등 물품 아이콘 — Stream 전용 아이콘 세트 (WDS의 `Icon/Normal/*` 네이밍과 다름)
- `Status Bar - iPhone`, `Home Bar` — WDS가 아니라 별도로 연결된 **iOS and iPadOS 26 (Community)** 라이브러리 소속으로 추정

### 재검증: `Bottom Nav` / `Modal` / `Section-header`

`@wanteddev/wds` 코드 패키지에는 `bottom-navigation`, `modal`, `section-header` 컴포넌트가 실제로 존재해서 이 셋이 WDS일 가능성을 재검토했으나, Figma 쪽 이름으로 다시 검색한 결과 **원래 분류(Stream 로컬)가 맞다**:

- `Bottom Nav` — WDS에는 `Bottom Navigation/Bottom Navigation`이라는 이름으로 존재(componentKey `e0bf6586448b2b496500a76ee51838f44eb562d6`). Stream 파일의 `component` 섹션에는 이와 별개로 `Bottom Nav`라는 **로컬 컴포넌트 셋**이 직접 정의돼 있고(`Selected=Home/Event/Board/Rental` variant), 화면에서 쓰이는 인스턴스 이름도 `Bottom Navigation/Bottom Navigation`이 아니라 `Bottom Nav`다. 즉 디자이너가 WDS 컴포넌트를 안 쓰고 로컬로 새로 만든 것.
- `Modal` — WDS 라이브러리에서 "Modal"로 검색해도 이름이 일치하는 컴포넌트가 없음(가장 가까운 결과가 무관한 `Icon/Normal/Medal`). Stream 파일의 `Modal`/`Modal/ButtonGroup`은 `Circle Exclamation=on/off`, `Style=Default/Negative` 같은 Stream 전용 variant를 가진 로컬 컴포넌트 셋.
- `Section-header` — WDS 라이브러리에서 "Section Header"로 검색해도 결과 0건. Stream 파일 안의 로컬 컴포넌트.

**주의**: 이건 "Figma 디자인 파일이 어떤 컴포넌트를 참조하고 있는가"에 대한 결론이지, "코드에서 무엇을 써야 하는가"와는 다른 질문이다. `wds`의 `Modal`/`BottomNavigation`/`SectionHeader` 코드 컴포넌트는 여전히 존재하므로, 실제 구현 시에는 (디자인이 로컬로 그려졌더라도) WDS 코드 컴포넌트를 기반으로 만드는 게 나을 수 있다 — 이건 구현 단계에서 별도로 판단할 문제.

## 완전 확정 방법 (필요 시)

이름 대조가 아니라 100% 확정하려면, 확인하고 싶은 인스턴스의 `nodeId`를 알아낸 뒤 `get_design_context(fileKey, nodeId)`를 호출해 응답에 포함된 componentKey를 위 표의 WDS componentKey와 직접 비교하면 된다. 또는 Figma 앱에서 인스턴스 선택 → 우측 패널 "Instance of" → 라이브러리 아이콘 클릭으로도 즉시 확인 가능하다.
