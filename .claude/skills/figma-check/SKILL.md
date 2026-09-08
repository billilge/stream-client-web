---
name: figma-check
description: 이미 구현된 코드가 Figma 디자인과 1:1로 일치하는지 교차검증한다. 색상 토큰, WDS 컴포넌트 사용 판단, 레이아웃/패딩, 실제 렌더링 스크린샷까지 대조해서 불일치를 번호 매겨 리포트한다. /figma-check <figma URL 또는 node-id> [코드 파일 경로]로 호출한다.
---

# /figma-check — Figma ↔ 구현 교차검증 워크플로우

`/component`로 만든 코드가 시간이 지나거나 다른 세션에서 수정되면서 Figma 원본과 어긋나지 않았는지 확인한다. **이 스킬은 검증만 한다 — 발견한 불일치를 자동으로 고치지 않는다.** 수정은 사용자가 결과를 보고 별도로 요청할 때 진행한다.

> **발동 조건**: `/figma-check`로 호출했을 때. 뒤에 Figma URL(node-id 포함) 또는 node-id가 없으면 임의로 노드를 고르지 말고 사용자에게 요청한다.
> **`/component`와의 관계**: `/component`가 "Figma → 코드"를 만드는 스킬이라면, 이 스킬은 그 결과물이 여전히 Figma와 맞는지 "코드 ↔ Figma"를 되짚어 확인하는 스킬이다. 둘 다 같은 컨벤션 문서(`docs/conventions/component-convention.md`, `wds-component-usage.md`)를 기준으로 삼는다.

## 상수

```
Stream fileKey: 3QkxTuGLZkB17pZILTog9L
WDS libraryKey: lk-01f447137a741b37c25896e9a4e109dcb719fa4e54177be9a39d24b8da507c109279c2d1d0533b9943595d7d6a5ea398977f43b5d84e163797965d810ba79b69
```

Figma URL이 주어지면 거기서 fileKey/nodeId를 추출한다. node-id만 주어지고 fileKey가 없으면 위 Stream fileKey를 기본값으로 쓴다.

## Step 1 — 대상 코드 파일 확정

- 사용자가 코드 경로를 같이 줬으면 그걸 쓴다.
- 안 줬으면 `component-convention.md`가 요구하는 `// Figma: ... (nodeId <id>)` 파일 최상단 주석을 근거로 찾는다:

```bash
grep -rln "nodeId <해당 id>\|nodeId \`<해당 id>\`" src/ --include="*.tsx"
```

- 매칭이 여러 개거나 하나도 없으면 임의로 고르지 말고 사용자에게 확인한다. 검증 대상이 화면 전체(여러 컴포넌트로 조립됨)면, `get_metadata`로 하위 노드 구조를 먼저 파악해 관련 컴포넌트 파일들을 전부 나열한다.

## Step 2 — Figma 레퍼런스 수집

대상 노드에 대해 아래 세 가지를 받는다 (`figma:figma-design-to-code` 스킬도 함께 로드).

1. `get_design_context(fileKey, nodeId)` — 레퍼런스 JSX/스타일과 "Component descriptions" 섹션(WDS 메인 컴포넌트 Node ID·문서 링크 확정용)
2. `get_screenshot(fileKey, nodeId)` — 비교용 스크린샷. 로컬에 저장해둔다
3. `get_variable_defs(fileKey, nodeId)` — 이 노드에서 실제 쓰이는 Figma 변수명과 값(색상·타이포)

## Step 3 — 실제 렌더링 캡처

1. dev 서버가 안 떠 있으면 `pnpm dev`로 띄운다(포트 충돌 시 기존 프로세스 정리 후 재시작).
2. `run` 스킬(또는 `chromium-cli`, 없으면 `npx playwright`)로 대상 화면/컴포넌트를 렌더링해서 스크린샷을 찍는다. 특정 variant(예: 선택 상태, 스테퍼 모드)를 봐야 하면 클릭 등으로 상태를 재현한 뒤 캡처한다.
3. 확인이 끝나면 띄운 dev 서버는 정리한다(사용자가 계속 쓰라고 하지 않는 한).

## Step 4 — 교차검증 체크리스트

아래 다섯 가지를 순서대로 확인한다. 항목마다 통과/불일치를 기록해둔다.

1. **비주얼 비교**: Step 2의 Figma 스크린샷과 Step 3의 실제 렌더링을 나란히 놓고 본다. 레이아웃, 정렬, 간격, 색감, 잘림 여부를 확인한다.
2. **색상 토큰**: 대상 코드에 `text-[#...]`, `bg-[#...]`, `border-[#...]` 같은 하드코딩 hex가 남아있으면 전부 지적한다. `docs/conventions/component-convention.md`의 "색상 토큰" 규칙대로 `src/index.css`의 `@theme` 토큰을 써야 한다. 이미 토큰이 있는데 못 찾고 hex를 새로 박은 경우도 있을 수 있으니, hex 값을 Step 2의 `get_variable_defs` 결과와 대조해서 맞는 토큰이 있는지 확인한다. 이름이 비슷해도 값이 다른 토큰들(예: `Line/Normal/Neutral` 반투명 vs `Line/Solid/Neutral` 불투명)을 혼동하지 않았는지 특히 주의한다.
3. **WDS 판단 재검증**: 코드가 `@wanteddev/wds`/`@wanteddev/wds-icon`을 import하는 자리마다 `docs/conventions/wds-component-usage.md`에 그 판단 근거가 있는지 확인한다. 없으면 Step 2의 Component descriptions로 확정하고 문서에 추가한다. 반대 방향도 확인한다 — Stream 로컬로 새로 만든 부분이 사실 WDS 컴포넌트인 경우, 또는 이름은 같지만 실제로는 다른 스타일(활성 상태 표현 등)이라 Stream 로컬이 맞는 경우.
4. **박스모델 실측**: 브라우저에서 대표 요소 하나를 골라 `getComputedStyle`로 padding/border-width/margin이 의도한 값과 맞는지 찍어본다. 특히 `0px`으로 죽어있으면 CSS 우선순위 문제(예: 레이어 밖 전역 reset이 Tailwind 유틸리티를 이기는 문제 — `docs/plans/rental-list-screen.md` 참고)를 의심한다.
5. **컴포넌트 기본값 재확인**: WDS 컴포넌트를 쓸 때 명시하지 않은 prop의 기본값이 Figma 디자인과 다른 걸 렌더링하고 있지 않은지 확인한다(예: `TopNavigation`의 기본 `variant="normal"`이 타이틀을 가운데 정렬시켜서 Figma의 좌측 정렬과 어긋났던 사례, `background` 기본값이 iOS 반투명 스타일이라 배경색이 미묘하게 달라 보였던 사례). 의심되면 해당 컴포넌트의 `node_modules/@wanteddev/wds/dist/components/<name>/style.js`를 직접 열어 실제 동작을 확인한다.

## Step 5 — 결과 안내

`pr-check` 스킬과 같은 형식으로, 발견한 불일치를 중요도 순으로 번호 매겨 나열한다.

```
## Figma 교차검증 결과 — {대상} (nodeId {id})

1. 🔴 [파일:라인] 무엇이 다른지
   - Figma: {기대값}
   - 코드: {실제값}
   - 수정 방안: {한두 문장}

2. 🟡 [파일:라인] ...
```

- 🔴 High: 화면에 실제로 다르게 보이는 것(레이아웃 깨짐, 색 틀림, WDS 컴포넌트 오판으로 동작이 다름)
- 🟡 Medium: 지금 당장 안 보이지만 잠재적으로 문제(하드코딩 hex가 토큰과 값은 같지만 토큰을 안 써서 나중에 디자인 바뀌면 안 따라가는 경우 등)
- 🟢 Low: 사소한 스타일 차이, 주석/문서 누락
- 전부 통과했으면 "N개 항목 모두 Figma와 일치" 로 짧게 알린다.
- 새로 확정된 WDS 매핑이나 색상 토큰이 있으면 `docs/conventions/wds-component-usage.md` / `component-convention.md`에 반영했는지 짚어준다.
