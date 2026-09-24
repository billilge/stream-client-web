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
| `Top Navigation/Resource/Leading/Normal/Default` | 아카이빙 상세 화면(`1276:95397`) Top Navigation 뒤로가기 | `440:7986` |
| `Button/Icon/Normal` | 아카이빙 상세 화면 Top Navigation 트레일링 검색 버튼 | `440:7585` — [문서](https://montage.wanted.co.kr/docs/components/actions/icon-button/design) |
| `Icon/Normal/Chevron Left` | 아카이빙 상세 화면 Top Navigation 뒤로가기 아이콘 | `440:7931` |
| `Icon/Normal/Chevron Down` | 아카이빙 상세 화면 연도 필터 "~2023" 칩 트레일링 아이콘 | `487:18965` |
| `Menu/Menu` | 아카이빙 상세 - 이전 연도 드롭다운(`1529:172165`) 연도 목록 | `820:40656` — [문서](https://montage.wanted.co.kr/docs/components/presentation/menu/design) |
| `List Cell/List Cell` | 위 `Menu/Menu` 안의 각 연도 항목 | `445:5923` — [문서](https://montage.wanted.co.kr/docs/components/contents/list-cell/design) |
| `Top Navigation/Resource/Contents` (타이틀 없는 투명 헤더) | 아카이빙 상세(`1526:171215`) 대표 사진 위 뒤로가기·공유 버튼 | `ScreenHeader variant="floating"` → `TopNavigation variant="floating" background={false}` |
| `Icon/Normal/Share` | 아카이빙 상세 Top Navigation 트레일링 공유 버튼 | `1490:167136` |
| `Page Indicator/Counter` (Size=Small, Alternative=True) | 현장 사진 뷰어(`1526:171364`) 하단 "4 / 23" 카운터 | `471:13818` — [문서](https://montage.wanted.co.kr/docs/components/navigations/page-counter/design), 코드 `PageCounter size="small" alternative` |
| `Icon/Normal/Close` | 현장 사진 뷰어 Top Navigation 트레일링 닫기 버튼 | `445:12096`, 코드 `IconClose` |

코드에서는 `@wanteddev/wds-icon`의 `IconSearch`/`IconBell`/`IconHome`/`IconTicket`/`IconList`/`IconChevronLeft`/`IconChevronDown`으로 대응된다(각각 default export를 `index.d.ts`에서 named export로 재노출). `Segmented Control`은 `@wanteddev/wds`의 `SegmentedControl`/`SegmentedControlItem`으로 대응된다. `Menu/Menu`는 `Menu`/`MenuTrigger`/`MenuContent`/`MenuList`/`MenuItem`으로 대응된다(`MenuItem`이 내부에서 `ListCell`을 렌더링하므로 `List Cell`을 따로 import하지 않는다). `Menu`는 항목을 골라도 자동으로 닫히지 않아 `open`/`onOpenChange`로 직접 닫아야 하고, `MenuContent` 기본 너비가 320px라 Figma 너비와 다르면 `sx`로 맞춘다. Top Navigation의 Leading(뒤로가기)·Trailing 아이콘 버튼은 `TopNavigation`의 `leadingContent`/`trailingContent`에 `TopNavigationButton variant="icon"`으로 넣는다. 단, 아카이빙 상세처럼 사진 위 흰 아이콘 버튼은 `TopNavigationButton`의 `color`가 `primary`/`assistive`만 받아서, 내부에서 렌더링되는 `IconButton`(`variant="normal"`, `size={24}`, `color="semantic.static.white"`)을 직접 쓴다. `Icon/Normal/Share`는 `IconShare`로 대응된다.

아카이빙 상세 화면의 연도 필터 칩(`Chip`, `1276:95404`)과 사진 카드(`Left-Large`/`Left-Medium`/`Right-Small`/`Right-Large`)는 WDS 컴포넌트 설명이 붙어 있지 않은 Stream 로컬 요소다 — 칩 스타일은 아래 "빌릴게 필터 Chip" 반례와 같아서, 최근 연도 칩은 빌릴게·행사와 공용인 `components/ui/FilterChipGroup.tsx`를 그대로 쓴다(이전 연도 드롭다운 트리거만 같은 칩 모양의 로컬 버튼이라 `getFilterChipClassName`을 가져다 쓴다). 코드는 `src/features/archives/components/` 참고.

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
- `Icon/Feedback`, `Icon/Camera`, `Icon/Link`, `Icon/Answer`, `Icon/Question`, `Icon/Activity`, `Icon/Arrow` 및 고데기·알약·후시딘 등 물품 아이콘 — Stream 전용 아이콘 세트 (WDS의 `Icon/Normal/*` 네이밍과 다름)
- `Status Bar - iPhone`, `Home Bar` — WDS가 아니라 별도로 연결된 **iOS and iPadOS 26 (Community)** 라이브러리 소속으로 추정

### 재검증: `Bottom Nav` / `Modal` / `Section-header`

`@wanteddev/wds` 코드 패키지에는 `bottom-navigation`, `modal`, `section-header` 컴포넌트가 실제로 존재해서 이 셋이 WDS일 가능성을 재검토했으나, Figma 쪽 이름으로 다시 검색한 결과 **원래 분류(Stream 로컬)가 맞다**:

- `Bottom Nav` — WDS에는 `Bottom Navigation/Bottom Navigation`이라는 이름으로 존재(componentKey `e0bf6586448b2b496500a76ee51838f44eb562d6`). Stream 파일의 `component` 섹션에는 이와 별개로 `Bottom Nav`라는 **로컬 컴포넌트 셋**이 직접 정의돼 있고(`Selected=Home/Event/Board/Rental` variant), 화면에서 쓰이는 인스턴스 이름도 `Bottom Navigation/Bottom Navigation`이 아니라 `Bottom Nav`다. 즉 디자이너가 WDS 컴포넌트를 안 쓰고 로컬로 새로 만든 것.
- `Modal` — WDS 라이브러리에서 "Modal"로 검색해도 이름이 일치하는 컴포넌트가 없음(가장 가까운 결과가 무관한 `Icon/Normal/Medal`). Stream 파일의 `Modal`/`Modal/ButtonGroup`은 `Circle Exclamation=on/off`, `Style=Default/Negative` 같은 Stream 전용 variant를 가진 로컬 컴포넌트 셋.
- `Section-header` — WDS 라이브러리에서 "Section Header"로 검색해도 결과 0건. Stream 파일 안의 로컬 컴포넌트.

**주의**: 이건 "Figma 디자인 파일이 어떤 컴포넌트를 참조하고 있는가"에 대한 결론이지, "코드에서 무엇을 써야 하는가"와는 다른 질문이다. `wds`의 `Modal`/`BottomNavigation`/`SectionHeader` 코드 컴포넌트는 여전히 존재하므로, 실제 구현 시에는 (디자인이 로컬로 그려졌더라도) WDS 코드 컴포넌트를 기반으로 만드는 게 나을 수 있다 — 이건 구현 단계에서 별도로 판단할 문제.

## 완전 확정 방법 (필요 시)

이름 대조가 아니라 100% 확정하려면, 확인하고 싶은 인스턴스의 `nodeId`를 알아낸 뒤 `get_design_context(fileKey, nodeId)`를 호출해 응답에 포함된 componentKey를 위 표의 WDS componentKey와 직접 비교하면 된다. 또는 Figma 앱에서 인스턴스 선택 → 우측 패널 "Instance of" → 라이브러리 아이콘 클릭으로도 즉시 확인 가능하다.

## 행사 목록 화면(`1243:70854`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 코드 export | 확인 내용 |
|---|---|---|
| `Content Badge/Content Badge` | `ContentBadge` | 메인 컴포넌트 Node ID `445:5656` — [문서](https://montage.wanted.co.kr/docs/components/contents/content-badge/design) |
| `Divider/Divider` | `Divider` | `color`에 토큰 문자열을 넘긴다(`color="semantic.line.normal.alternative"`). Figma의 `divider(new)`가 이 값(`rgba(112,115,124,0.08)`, 1px)이라 로컬로 선을 그리지 않고 WDS를 쓴다 |

### `ContentBadge`의 accent/neutral 분기가 Figma 구조와 1:1로 맞는다

Figma의 Content Badge는 상태에 따라 배경 처리 방식이 두 가지다 — "accent 색을 8% 오퍼시티 레이어로 깐 것"(모집중·모집예정)과 "이미 알파가 포함된 `Fill/Normal`을 그대로 쓴 것"(모집종료). 한 가지 방식으로 뭉뚱그리면 색이 틀어지는데, `ContentBadge`의 `color` prop이 정확히 이 둘로 갈린다(`content-badge/style.js`의 `contentBadgeColorStyle`):

- `color="accent"` + `accentColor` → `background: addOpacity(accentColor, opacity[8])`, 글자는 `accentColor` 원색
- `color="neutral"` + `neutralColor` → `background: theme.semantic.fill.normal`, 글자는 `neutralColor`

`size="small"`도 Figma 스펙(`padding: 4px 6px`, `caption1/medium`)과 그대로 일치한다. 실제로 쓴 토큰:

| 상태 | props | 실측 결과 |
|---|---|---|
| 모집중 | `color="accent" accentColor="semantic.accent.foreground.redOrange"` | `rgba(245,90,0,0.08)` / `#F55A00` |
| 모집예정 | `color="accent" accentColor="semantic.accent.foreground.cyan"` | `rgba(0,152,178,0.08)` / `#0098B2` |
| 모집종료 | `color="neutral" neutralColor="semantic.label.alternative"` | `rgba(112,115,124,0.08)` / `rgba(55,56,60,0.61)` |

### `Button`의 `size="small"` 타이포는 버튼이 아니라 `& > span`에 걸린다

`button/style.js`의 `small` 분기는 `& > span { typographyStyle("label2", fontWeight) }` 형태라, `getComputedStyle(button).fontSize`를 재면 상속값 16px이 나오고 실제 글자는 안쪽 span의 13px이다. 검증할 때 버튼 엘리먼트를 재면 틀린 결론이 난다.

또한 행사 카드 CTA는 빌릴게 카드와 달리 `sx` 보정이 필요 없다. Figma의 비활성 상태 색(`Interaction/Disable #F4F4F5` + `Label/Assistive`)이 WDS `Button`의 `&[aria-disabled='true']` 블록과 그대로 같아서 `disabled` prop만 주면 된다.

### 헤더 아래 "Tool" 영역은 화면이 직접 그린다 — `ScreenHeader`는 받지 않는다

행사 화면 헤더(`1765:70732`)는 **로컬 `Top Navigation`(`1765:70665`, 0~56)** 과 **형제 노드인 `Segmented Control`(`1765:70708`, y=56 x=20 w=335 h=32)** 로 나뉜다. 예전에는 WDS `Top Navigation/Resource/Contents` 하나가 내부 `Tool` 슬롯까지 품은 높이 88짜리 인스턴스였는데, 디자인이 바뀌면서 둘로 분리됐다(`ScreenHeader`의 display variant가 WDS를 떠나 로컬 마크업이 된 것과 같은 변경). 빌릴게(`1765:71192`)도 프레임 이름까지 같은 동일 구조다.

Tool 영역은 `88 - 56 - 32 = 0`, 즉 **위아래 여백이 없다.** 세로 패딩을 주면 토글과 그 아래 필터 행이 함께 밀린다. 가로는 x=20이라 `px-5`로 맞춘다.

**배치는 화면 본문 최상단에 `shrink-0`으로 한다.** 한때 `ScreenHeader`에 `toolbar` prop을 두고 헤더가 같이 들고 있었는데 제거했다. 근거가 두 가지였고 둘 다 성립하지 않았다:

1. *"WDS API를 쓰는 것이다"* — WDS `TopNavigation`에 `toolbar?: ReactNode`("Area attached below the navigation")가 실제로 있다. 그런데 `ScreenHeader`의 `display` variant는 로컬 마크업으로 바뀌면서 WDS `TopNavigation`을 안 쓰게 됐고, `normal` variant는 WDS를 쓰지만 `toolbar`를 넘기지 않았다. 즉 **WDS의 그 prop은 한 번도 안 쓰였고**, 남은 건 우리가 만든 슬롯뿐이었다.
2. *"본문에 두면 스크롤 경계가 화면마다 달라진다"* — 측정으로 반박됐다. 헤더 슬롯이든 본문이든 양쪽 다 `shrink-0`이고 실제 스크롤은 그 아래 `overflow-y-auto` 목록에서만 일어난다. 뷰포트를 줄여 끝까지 스크롤(빌릴게 1365px / 행사 80px)해도 타이틀·툴·필터 top이 1px도 움직이지 않았다.

임의의 `ReactNode`를 받는 슬롯은 `ScreenHeader`가 내용을 판단할 수 없어 패스스루 컨테이너가 되고, 화면마다 존재 여부가 달라지면서 책임 범위가 타이틀 + 트레일링 아이콘을 넘어 계속 넓어진다(제거 시점에 이미 행사·게시판 2개 화면이 쓰고 있었다). 세 화면(행사·게시판·빌릴게)을 본문 배치로 통일했고, 이동 전후 렌더 결과는 세 화면 모두 픽셀 단위로 동일했다.

### 필터 칩 반례가 행사 화면에서도 확인됐다

위 "빌릴게 필터 Chip은 WDS `Chip/Chip`이 아니었다" 항목과 같은 결론이다. 행사 화면의 상태 필터 칩(전체/모집중/모집예정/모집종료, `1243:70862`)도 `get_design_context`로 열어보니 원본이 Stream 로컬 컴포넌트 `1016:55355`였고, 스타일도 빌릴게 카테고리 필터와 완전히 동일했다(활성 = `Blue/95` 배경 + `Primary/Normal` 외곽선·글자). 두 화면이 같은 칩을 쓰는 게 확인돼 `src/components/ui/FilterChipGroup.tsx`로 공용화했다.

### 미해결: WDS Navigation 행이 Figma보다 8px 높다

Figma의 `Navigation` 프레임은 56px(패딩 16 + 내부 24)인데, 타이틀 텍스트(32px)가 24px짜리 `Section` 위로 오버플로우되도록 배치돼 있다. WDS `TopNavigation`은 이 32px을 행 높이에 그대로 더해서 64px이 된다. 그 결과 헤더 아래 모든 요소가 8px씩 내려간다. **홈·빌릴게를 포함한 모든 화면에 공통으로 해당**하며(빌릴게 헤더도 실측 64px), 특정 화면에서 고칠 문제가 아니라 `ScreenHeader` 차원에서 판단할 사안이라 별도로 남겨둔다.

## 게시판 - 공지 화면(`1256:81776`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 확인 경로 | WDS 메인 컴포넌트 Node ID / 문서 |
|---|---|---|
| `Tab/Tab` | 게시판-공지 화면 상단 전체/일반 공지/제휴 공지 탭 | `440:7593` — [문서](https://montage.wanted.co.kr/docs/components/navigations/tab/design). 코드 export는 `Tab`(컨텍스트)+`TabList`+`TabListItem` 3개 조합(`TabItem` 같은 단일 export 아님) — `node_modules/@wanteddev/wds/dist/components/tab/`에서 확인 |

"공지"/"열린피드백" 2단 타이틀(Figma `Board Title`, nodeId `1256:81792`)은 새로 컴포넌트를 만들지 않고 `ScreenHeader`의 `ScreenHeaderToggleTitle`(`title={{ options, activeIndex }}`)을 그대로 썼다 — 정확히 이 패턴을 위해 만들어진 슬롯이다.

### 반례 — 고정 핀 아이콘은 `Icon/Normal/Pin`(WDS)이 아니었다

`search_design_system`으로 "Icon/Normal/Pin" 이름이 WDS 라이브러리에 있는 걸 확인하고 한 번은 WDS로 판단했었다. 그런데 `/figma-check`로 재검증하며 해당 인스턴스(`1256:76326`)의 실제 SVG 에셋을 직접 열어보니, `wds-icon`의 `IconPin`/`IconPinFill`(둘 다 똑바로 선 압정 모양, `currentColor` 상속)과 달리 **기울어진 압정 모양 + `#0066FF` 고정 fill**이 박힌 별개의 도형이었다 — `get_design_context` 응답의 "Component descriptions"에도 이 아이콘 항목이 아예 없었는데(있었다면 처음부터 알아챘을 것) 그때는 놓치고 이름 매칭만 믿었다. **이름이 WDS 컴포넌트와 같아도, `search_design_system` 이름 매칭만으로 확정하지 말고 이 문서의 "완전 확정 방법"(실제 SVG/컴포넌트 설명 대조)까지 거쳐야 한다.** 코드는 실제 Figma SVG를 그대로 받아 `src/assets/icons/pin.svg` + `src/features/notices/components/NoticesCard.tsx` 참고.

### 참고 — Notice-card 사이 구분선은 `divider(new)`가 아니라 WDS `Divider`를 쓴다

133번째 줄 아래 "제외됨" 표에는 `divider(new)`가 Stream 로컬로 남아있지만, 161번째 줄 "행사 목록 화면" 절에서 이미 확인했듯 이 값(`rgba(112,115,124,0.08)`, 1px)은 WDS `Divider`의 `color="semantic.line.normal.alternative"`와 정확히 같다. 게시판-공지 화면도 같은 값이라 로컬 div 대신 `Divider`를 그대로 썼다(`src/features/notices/NoticesListScreen.tsx`). "제외됨" 표의 `divider(new)` 항목은 이름 기준 분류일 뿐 실제 코드 구현은 이 절을 따른다.

## 행사 상세(`1133:42433` 모집중 / `1156:53992` 모집예정)·행사 목록 empty(`1165:62713`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 확인 경로 | 코드 export / 비고 |
|---|---|---|
| `Page Indicator/Counter` | 행사 상세 Hero 우하단 `1/7` | `PageCounter` — 폴더명이 `page-counter`라 Figma 이름(`Page Indicator/...`)과 다르다. props는 `totalPages: number`(필수)·`currentPage: number`·`size: 'small' \| 'medium'`로 숫자를 받는다(Figma는 문자열 variant) |

### `ContentBadge`의 `size`는 화면마다 다르다 — 목록 `small`, 상세 `medium`

같은 Content Badge인데 Figma 스펙이 화면별로 갈린다. `content-badge/style.js`의 size 분기와 1:1로 맞는다:

| 화면 | Figma 스펙 | `size` | WDS 실제 값 |
|---|---|---|---|
| 목록 카드 | padding 4/6, Caption 1/Medium(12px) | `small` | `padding: 4px 6px` + `caption1/medium` |
| 상세 | padding 5/8, Label 2/Medium(13px) | `medium` | `padding: 5px 8px` + `label2/medium` |

상태→색 매핑(accent/neutral)은 두 화면이 같아서 `src/features/events/components/EventsStatusBadge.tsx`로 모았다. 매핑을 카드·상세 두 곳에 적지 않기 위한 것이고, 화면별로 다른 건 `size` prop뿐이다.

### Empty State는 여전히 Stream 로컬 — WDS `FallbackView`를 검토했지만 스펙이 다르다

WDS에 `FallbackView`/`FallbackViewImage`/`FallbackViewContent`/`FallbackViewText`/`FallbackViewButton`이 있어 구조(일러스트 + 타이틀·설명 + 버튼)가 Figma `Empty State`와 같다. 그래서 "제외됨" 표의 로컬 분류를 재확인했는데, 실측값이 어긋난다:

| 항목 | WDS `FallbackView` | Figma `1165:62725` |
|---|---|---|
| 일러스트 폭 | 128px / 160px | 81px 박스 안 71×70.109 |
| 상하 패딩 | 80px / 160px (`padding` variant) | 없음(부모가 가운데 정렬) |
| 컨테이너 폭 | 335 / 400 | 203px |
| 타이틀 색 | `label.normal` | `label/neutral` |

내부 패딩·폭·색을 오버라이드해야 맞출 수 있어서(`component-convention.md` "WDS 컴포넌트 내부를 임의로 오버라이드하지 않는다") 바깥 레이아웃만 로컬로 짜고 내부 요소(`Typography`, `Button`)는 WDS로 채웠다. `src/features/events/components/EventsEmptyState.tsx` 참고.

### Empty State 버튼은 `Button variant="outlined" color="assistive"`가 정확히 일치한다

Figma 버튼(`1165:62920`)은 투명 배경 + `Line/Normal/Neutral` 1px 보더 + `Label/Normal` 글자 + Label 2(13px)다. `button/style.js`의 `variant === "outlined" && color === "assistive"` 분기가 `background-color: transparent` / `box-shadow: inset 0 0 0 1px line.normal.neutral` / `color: label.normal`로 그대로 같고, `size="small"`이 padding 7/14·radius 8·label2를 준다. `sx` 보정이 필요 없다.

### 본문 긴 글은 `Typography variant="label1-reading"`

Figma의 `Label 1/Reading - Regular`(14px, line-height 1.571)는 `label1`(1.429)과 다른 별개 변형이다. `TypographyVariant`에 `label1-reading`·`body1-reading`·`body2-reading`이 따로 있으니 Figma 이름에 "Reading"이 붙으면 이쪽을 쓴다. `label1`로 쓰면 줄간격이 좁아진다.

### 행사 상세의 오버레이 헤더는 `ScreenHeader`를 쓰지 않는다

Figma 상세는 뒤로가기 버튼이 Hero 이미지 **위에 떠 있는** 오버레이다(`Top Navigation/Resource/Contents`가 `top: 54`에 absolute로 얹혀 있고 Hero는 `top: 0`부터 시작). `ScreenLayout`의 헤더 슬롯은 본문 위에 자리를 차지하는 구조라 이 배치를 만들 수 없다.

`useScreenHeader`를 호출하지 않으면 슬롯이 `null`(0px)로 남으므로(`useScreenHeader`가 unmount 시 `setHeader(null)`을 한다), 상세 화면은 훅을 아예 호출하지 않고 Hero 안에 `absolute`로 `TopNavigationButton variant="icon"` + `IconChevronLeft`를 얹는다. 버튼 자체는 WDS를 그대로 쓴다.

`ScreenHeader`에 `overlay` prop을 추가하는 방안도 검토했지만(슬롯을 `absolute inset-x-0 top-0 z-10`으로 띄우면 가능 — `ScreenLayout` 프레임이 `relative`다) 공용 컴포넌트가 다른 화면에 영향을 주는 변경이라 로컬로 뒀다. 같은 오버레이 패턴이 두 번째 화면에 나오면 그때 `ScreenHeader`로 올린다(`component-convention.md` §1의 "두 번째 화면에서 실제로 재사용될 때" 규칙과 같은 기준).
## 행사 신청 제출 실패 토스트(`1450:93026`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 코드 export | 확인 내용 |
|---|---|---|
| `Toast/Toast` | `Toast` + `ToastContainer` + `ToastIcon` + `ToastContent` | 메인 컴포넌트 Node ID `516:23034` — [문서](https://montage.wanted.co.kr/docs/components/feedback/toast/design). Figma 인스턴스 내부 구조(Background 2겹 / Container / Content / Icon / Message)가 WDS 구현(`toast/style.js`)과 1:1로 대응한다 |

스타일은 손댈 게 없었다. Figma와 WDS 기본값이 그대로 같다 — `padding: 11px 16px`, `border-radius: 12px`, `backdrop-filter: blur(32px)`, 배경 `Inverse/Background @52%` + `Primary/Normal @5%` 2겹, 본문 `Body 2 Bold`(15px SemiBold) `Static/White @88%`, 아이콘-문구 간격 8px. 실측도 Figma와 같은 335×54였다.

대신 **아이콘과 배치 두 가지는 우리가 넘겨야 했다.**

### 1. `variant="negative"`의 기본 아이콘은 Figma와 다르다 (X ≠ 느낌표)

`toast/constants.js`의 `toastIconComponent.negative`는 `IconCircleCloseFill`(X 표시)인데 Figma는 `Icon/Normal/Circle Exclamation`(느낌표)다. 색은 둘 다 `Atomic/Red/60`(#FF6363)으로 같다. 그래서 `ToastIcon`에 children으로 `IconCircleExclamationFill`을 직접 넘긴다.

이때 **흰 바탕을 같이 깔아야 한다.** WDS `*Fill` 아이콘의 안쪽 기호는 칠한 게 아니라 뚫린 자리(`fill-rule: evenodd`)라, 반투명한 토스트 배경 위에서는 느낌표가 하얗게 보이지 않고 배경이 그대로 비친다. WDS 기본 아이콘도 같은 이유로 `toastCircleIconWrapperStyle`에서 `::before`로 8×10 흰 pill을 뒤에 깐다 — 직접 넘길 때는 그 처리가 빠지므로 우리가 같은 걸 넣는다. Figma도 아이콘 안에 `Filler`(Static/White) 레이어를 같은 목적으로 두고 있다.

### 2. 기본 배치·최소 폭이 375 프레임 밖을 전제로 한다

- `container` 기본값이 `#wds-region-manager-bottom`이라, 그대로 쓰면 앱 프레임이 아니라 브라우저 화면 하단에 붙는다 → `disablePortal`로 끄고 화면 포털(`useScreenSheetPortal`)에 직접 그린다.
- 폭에 `min-width: 356px`(`breakpoint.sm` 이상)이 걸려 있는데, 그 기준이 앱 프레임이 아니라 **브라우저 창**이다. 데스크톱에서 보면 375px 프레임(좌우 20px 여백 기준 335px)을 넘친다 → 같은 미디어 쿼리 안에서 `minWidth: 0`으로 되돌린다. 평평한 `sx={{ minWidth: 0 }}`는 안 먹는다(emotion이 중첩 미디어 쿼리 블록을 평 선언보다 뒤에 붙여서 `min-width: 356px`가 이긴다).

코드는 `src/components/ui/ScreenToast.tsx`. 화면 위에 토스트를 띄우는 자리는 앞으로도 같을 것이라 공용으로 뒀다.

## 행사 신청 완료 화면(`1712:192283`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 코드 export | 확인 내용 |
|---|---|---|
| `Action Area/Action Area` (버튼 2개 가로) | `ActionArea variant="neutral"` + `ActionAreaButton` | 버튼 둘을 가로로 12px 간격, `flex: 1 1 0`으로 반반 나누는 게 WDS 기본 동작이라 감싸는 레이아웃이 필요 없다(`action-area/style.js`의 `actionButtonCancel`) |

### 왼쪽 "신청내역 보기"는 `variant="alternative"` 기본값(outlined)이 아니다

`ActionAreaButton variant="alternative"`는 `Button variant="outlined" color="primary"`(파란 테두리)로 그려지는데, Figma는 `Fill/Normal`(rgba(112,115,124,0.08)) 배경에 `Label/Neutral` 글자인 **solid assistive**다. WDS가 이런 경우를 위해 열어둔 `buttonVariant`/`buttonColor` prop으로 넘겼다 — 컴포넌트 내부를 건드리지 않는 방법이다. 세로 padding은 WDS가 12px(48px)인데 Figma Main Action이 16px(56px)이라 신청 폼과 같은 이유로 `sx`에서 맞춘다.

### 같은 "Event Summary" 카드인데 화면마다 타이포·배경·간격이 다르다

신청 폼(`1658:183393`)과 완료 화면(`1712:192310`)은 이름도 구조도 같은 카드지만 값이 다르다.

| | 신청 폼 | 완료 화면 |
|---|---|---|
| 배경 | `Background/Normal/Normal`(흰색) | `Background/Normal/Alternative`(#F7F7F8) |
| 행사명 | Heading 2/Bold 20px (`variant="heading2"`) | Headline 2/Bold 17px (`variant="headline2"`) |
| 메타 줄 간격 | 6px | 4px |
| 일러스트 | 있음 | 없음 |

화면 배경이 서로 반대라 카드 배경도 뒤집힌 것이다. 한 컴포넌트(`EventsSummaryCard`)에 `tone="normal" | "alternative"`로 묶었다 — 세 가지가 항상 같이 움직이는 한 벌이라 prop 하나로 충분하다. **WDS Typography에 17px은 `headline2`다**(`heading2`는 20px) — 이름이 비슷해서 헷갈리기 쉬운데, 처음엔 완료 화면에도 `heading2`를 써서 카드가 Figma보다 4px 높았다(실측 108px, Figma 104px).

### Circle Check(`1712:192849`)는 WDS 아이콘이 아니라 모션이 붙은 로컬 도형

`IconCircleCheckFill` 같은 WDS 아이콘이 아니다 — 72px 프레임 안에 60px `Primary/Normal` 원과 흰 체크 선이 따로 있고, 진입할 때 원이 튀어오르며 커지고(back-out) 체크 선이 그려진다(path trim). `get_design_context`의 Component description도 "System Check"뿐이고 montage 문서 링크가 없어서 WDS가 아닌 게 확정된다.

모션은 `src/assets/lottie/events/complete-check.json`(LottieFiles 플러그인 export)을 `LottieLight`로 재생한다 — 처음엔 `get_motion_context` 값을 보고 SVG path와 키프레임을 손으로 옮겼지만, 디자이너가 모션을 고칠 때마다 같은 노동이 반복돼서 Lottie로 바꿨다(`component-convention.md` "모션 (Lottie)" 참고). 코드는 `src/features/events/components/EventsCompleteCheck.tsx`.

### 행사 신청 중 마감 화면(`1133:43431`)도 같은 뼈대다

완료 화면과 구조가 같다 — 닫기(X)만 있는 `TopNavigation`, 그 아래 104px 간격, 가운데 일러스트 + 2줄 문구, 하단 Action Area. 다른 점은 버튼이 하나라서 `ActionArea`를 기본값(`variant="strong"`, 세로 배치)으로 쓰고 신청 폼과 같은 `sx={{ paddingBlock: "16px" }}` 보정만 한다는 것뿐이다. 자물쇠 일러스트(`1133:43439`)는 WDS 아이콘이 아니라 Figma 로컬 도형이라 SVG를 그대로 받아 `src/assets/icons/events/application-closed.svg`로 커밋했다(62.963×72.317).

### 제출 중 로딩 화면(`1133:43453`)에서 WDS는 `Typography`뿐이다

문서 일러스트와 체크 항목 3줄은 전부 Figma 로컬 도형이고(WDS 아이콘 아님), 3.4초 루프 모션이 붙어 있다(`Loading / Document Review`, 1133:44260). 이 일러스트 전체를 `src/assets/lottie/events/submitting.json`으로 받아 `LottieLight`로 재생한다 — 처음엔 path trim을 SVG로 인라인하고 문서 본체만 svg로 받았지만 Lottie로 바꿨다(`component-convention.md` "모션 (Lottie)" 참고).

LottieFiles export 원본(`Loading Content`)에는 문구 2줄도 벡터 도형으로 들어 있는데 그 레이어는 빼고 쓴다 — 문구 2줄은 WDS `Typography`(`heading1` 22px / `label1` 14px)로 그려야 스크린리더가 읽고 타이포 토큰도 따라간다. 코드는 `src/features/events/components/EventsSubmittingOverlay.tsx`.

## 공지 상세 화면(`1256:81842`, `1256:81856`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 확인 경로 | WDS 메인 컴포넌트 Node ID / 문서 |
|---|---|---|
| `Page Indicator/Counter` | 공지 상세 이미지 갤러리 우하단 "1/7" 카운터 | `471:13818` — [문서](https://montage.wanted.co.kr/docs/components/navigations/page-counter/design). 코드 export는 `PageCounter`(`totalPages`/`currentPage`/`size`/`alternative` props, `node_modules/@wanteddev/wds/dist/components/page-counter/`에서 확인) |

- `Content Badge`의 accent 색 분기(일반=`semantic.accent.foreground.blue`, 제휴=`semantic.accent.foreground.redOrange`)는 행사 화면의 `ContentBadge` accent 판단과 같은 구조라 재조사 없이 그대로 적용했다.
- 뒤로가기는 행사 신청 화면과 동일하게 `ScreenHeader variant="normal"`의 `leading`에 `TopNavigationButton`+`IconChevronLeft`를 넣는다("Top Navigation 뒤로가기" 절 참고). 공지 상세는 타이틀이 헤더가 아니라 본문(Title Details)에 있어서 `title` prop은 생략한다.
- 이미지 갤러리 배경은 실제 공지 사진 API 전까지 `bg-thumbnail-placeholder`(행사 카드와 동일 토큰)를 그대로 재사용했다.

### 반례 — `Content Badge`의 `size`는 화면마다 실측해야 한다(행사 카드의 `size="small"`을 그대로 베끼면 안 됨)

처음엔 행사 카드(`EventsCard`)가 `size="small"`을 쓰길래 재측정 없이 그대로 가져다 썼는데, `/figma-check`로 실측하니 이 화면의 뱃지는 padding `8px 5px`+`Label 2/Medium`(13px)로 WDS `size="medium"`(`content-badge/style.js`: `medium`=`padding: 5px 8px`+`label2`, `small`=`padding: 4px 6px`+`caption1`)과 일치했다 — Figma 인스턴스 자체의 radius만 8px로 `medium`의 10px과 다른데(`small`의 radius와 우연히 같음), padding·타이포가 다수 일치하는 쪽을 기준으로 `medium`으로 정정했다(radius 2px 차이는 WDS 내부 오버라이드 금지 원칙상 그대로 둔다). **같은 컴포넌트라도 화면마다 실측 없이 옆 화면의 prop 값을 그대로 베끼면 안 된다** — "빌릴게 필터 Chip" 반례와 같은 종류의 실수.

## 빌릴게 반납 화면(`1133:49973`) 구현 중 확정된 매핑

- **`RentalHistory Card` 사이 구분선도 위 절과 같은 값**이라 `Divider`(`color="semantic.line.normal.alternative"`)를 재사용했다. `/figma-check`에서 처음엔 raw `<div className="bg-line-normal-alternative">`로 만들어져 있던 걸 잡아냄 — 시각적 차이는 없지만(1px, 같은 색) 이미 문서화된 선례를 놓친 경우였다.
- **`Icon/Normal/Circle Check`(Fill) + `ContentBadge`류 아이콘**: 완료 토스트의 체크 아이콘은 `wds-icon`의 `IconCircleCheckFill`(Figma 이름 `circleCheckFill`과 정확히 매칭)을 그대로 썼다.

### 반례 — 반납 신청 확인 모달은 WDS `Alert`가 아니다

Figma 모달(nodeId `1133:50014`)이 WDS `Alert`(코드 컴포넌트로 존재)와 같은 "제목+설명+버튼 2개" 패턴이라 처음엔 `Alert`/`AlertContainer`/`AlertContent`를 검토했다. 그런데 `node_modules/@wanteddev/wds/dist/components/alert/style.js`를 직접 열어보니 `alertContainerStyle`이 `border-radius: 12px`, `min-width: 320px`(뷰포트 360px 미만에선 100%)로 고정돼 있어서, 이 모달의 실제 스펙(`border-radius: 24px`, 고정폭 `311px`, `padding: 24px 20px 20px`, 메시지-버튼 사이 `gap: 24px`)과 전혀 안 맞았다. `Alert`를 오버라이드하면 컨테이너 치수를 거의 다 갈아엎어야 해서, `component-convention.md`의 "WDS 컴포넌트 내부를 임의로 오버라이드하지 않는다" 원칙에 따라 컨테이너는 Stream 로컬로 새로 짰다. 다만 버튼은 WDS `Button`(`size="medium"`)이 `border-radius`(10px)·타이포(Body 2/Medium·Bold)까지 정확히 일치해서 그대로 재사용하고, 세로 패딩만(9px→12px) `sx`로 보정했다. 코드는 `src/features/bililge/components/BililgeReturnConfirmModal.tsx` 참고.

### 반례 — 반납 신청 완료 토스트는 WDS `useToast`/`Toast`를 안 쓴다

WDS는 `useToast` 훅 + `Toast` 컴포넌트로 토스트 시스템을 완비하고 있지만, 내부적으로 `#wds-region-manager-bottom`이라는 전역 포털 컨테이너(실제 브라우저 뷰포트 기준)에 렌더링된다. 이 앱은 375×812 고정 프레임을 데스크톱 화면 가운데 띄우는 구조(`App.tsx`)라, WDS 토스트를 그대로 쓰면 프레임 밖 실제 뷰포트 하단에 떠버린다 — **Bottom Nav를 WDS `BottomNavigation` 대신 로컬로 다시 만든 것과 정확히 같은 이유**(위 "Bottom Nav — 구현 시점 판단 결과" 절 참고)다. `BottomSheet`가 쓰는 것과 같은 화면 전용 포털(`useScreenSheetPortal`)에 직접 그리는 Stream 로컬 컴포넌트로 만들었다. 아이콘(`IconCircleCheckFill`)·타이포(`Typography` body2)는 WDS를 그대로 재사용했고, 배경(두 겹 반투명 레이어 + `backdrop-blur-[32px]`)만 Figma 값 그대로 옮겼다. 코드는 `src/features/bililge/components/BililgeReturnToast.tsx` 참고.

**앞으로 화면 전용 포털에 뭔가 띄워야 하는데(모달·토스트·바텀시트) WDS 컴포넌트가 있는 걸 발견하면, 먼저 그 컴포넌트가 어디에 렌더링되는지(`document.querySelector`/포털 대상)부터 확인한다** — 전역 뷰포트 기준이면 이 앱 구조상 항상 로컬로 다시 만들어야 한다.

## 게시판 - 열린피드백 목록 화면(`1410:50011`) 구현 중 확정된 매핑

| WDS 컴포넌트 | 확인 경로 | WDS 메인 컴포넌트 Node ID / 문서 |
|---|---|---|
| `Pagination/Dots` | 최근 피드백 캐러셀 하단 점 | `445:9563` — [문서](https://montage.wanted.co.kr/docs/components/navigations/pagination-dots/design). 코드 export는 `PaginationDots`(`totalPages`/`currentPage`/`size`/`color`/`onClickDot` props) |
| `Divider/Divider` | Q&A Card 내부 질문/답변 구분선 | `445:4786`. 위 "행사 목록 화면" 절과 같은 이유로 `color="semantic.line.normal.alternative"`로 사용 |

- `Q&A Card`, `Section Header`, `Floating Button`은 전부 기존 "제외됨" 표에 있던 Stream 로컬 컴포넌트라 그대로 새 컴포넌트로 만들었다(`FeedbacksQaCard`, 섹션 제목은 컴포넌트 없이 `Typography` 직접 사용, 작성 FAB는 화면 안에 인라인으로 둠 — 재사용처가 아직 없어서 `component-convention.md` §1 "애매하면 features/ 아래" 원칙대로).
- **`Icon/Question`도 `Icon/Answer`처럼 Stream 로컬로 확인**: `search_design_system`에 "Icon/Normal/Question"/"Icon/Normal/Circle Question"은 있지만 정확히 `Icon/Question`이라는 이름은 없고, `get_design_context` Component descriptions에도 잡히지 않았다 — Figma 원본 SVG를 그대로 받아 `src/assets/icons/feedbacks/{question,answer}.svg`로 커밋했다. "제외됨" 표에도 추가했다.
- **`Divider(new)`의 8px 버전은 1px 구분선과 다른 별개 패턴**: 지금까지 쓰던 `divider(new)`는 1px 헤어라인(WDS `Divider`로 대체)이었는데, 이 화면의 섹션 사이 구분선은 같은 이름의 8px 두꺼운 버전(`bg-background-alternative`, `#f7f7f8`)이다. 헤어라인이 아니라 섹션을 통째로 나누는 용도라 `Divider` 컴포넌트로 대체하지 않고 `<div className="h-2 w-full bg-background-alternative" />`로 직접 그렸다 — 이미 있는 토큰이라 새로 추가한 색은 없다.
- **`PaginationDots`는 부모 flex 컨테이너에 `items-center`가 없으면 왼쪽으로 붙는다**: 이 컴포넌트의 실제 루트(`tabindex` wrapper div)는 `className`/`sx` prop이 그 div까지 전달되지 않아 직접 센터링을 줄 수 없다(내부 tablist는 `width: fit-content`). `flex-col` 부모에 `items-center`를 주고, 형제 요소(캐러셀 스크롤 행)에는 `w-full`을 명시해서 폭을 유지해야 정확히 중앙에 온다 — `/figma-check`로 실측하다 발견된 버그.
- **`bg-background-alternative`(`#f7f7f8`)는 흰 배경과 3/255밖에 차이가 안 나서 화면에 따라 거의 안 보일 수 있다**: Q&A 카드 배경·8px 섹션 구분선 둘 다 이 값인데, 개별 레이어 단위로 `get_variable_defs`를 다시 떼어봐도 이 값 하나만 바인딩돼 있고 다른 색·테두리는 없었다 — 코드가 Figma 값을 정확히 따르고 있는 게 확인됐다. 그럼에도 시각적 구분이 약하다고 느껴지면, Figma 스펙을 벗어나 더 진한 톤(예: `Line/Normal/Neutral` `#70737c29`)으로 의도적으로 조정할지는 별도 논의 필요 — 이번 PR에서는 Figma 값 그대로 두었다.
