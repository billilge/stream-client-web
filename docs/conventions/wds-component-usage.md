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
