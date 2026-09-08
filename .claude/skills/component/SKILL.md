---
name: component
description: Figma Stream 파일의 노드를 코드 컴포넌트로 옮긴다. WDS(원티드 디자인 시스템) 컴포넌트로 확인되면 @wanteddev/wds를 import해서 재사용하고, Stream 고유 UI만 새로 만든다. /component <figma URL 또는 node-id>로 호출한다.
---

# /component — Figma → 코드 컴포넌트 변환 워크플로우

Stream Figma 파일의 노드를 받아서, WDS로 확인된 부분은 `@wanteddev/wds`를 import해 재사용하고 Stream 고유 UI만 새로 컴포넌트로 만드는 방식으로 코드를 생성한다. 모든 컴포넌트가 같은 구조를 따르게 하는 게 목적이다.

> **발동 조건**: `/component`로 호출했을 때. 뒤에 Figma URL(node-id 포함) 또는 node-id가 없으면 임의로 노드를 고르지 말고 사용자에게 요청한다.
> **`figma:figma-design-to-code` 스킬과의 관계**: 이 스킬을 대체하지 않는다. 그 스킬의 "기존 컴포넌트·토큰 재사용" 단계를 WDS 우선 규칙으로 구체화한 래퍼다. `get_design_context`를 호출하기 전 `figma-design-to-code` 스킬(또는 `skill://figma/figma-design-to-code/SKILL.md`)도 함께 로드한다.

## 상수

```
Stream fileKey: 3QkxTuGLZkB17pZILTog9L
WDS libraryKey: lk-01f447137a741b37c25896e9a4e109dcb719fa4e54177be9a39d24b8da507c109279c2d1d0533b9943595d7d6a5ea398977f43b5d84e163797965d810ba79b69
```

Figma URL이 주어지면 거기서 fileKey/nodeId를 추출한다. node-id만 주어지고 fileKey가 없으면 위 Stream fileKey를 기본값으로 쓴다(이 스킬은 Stream 파일 전용).

## Step 1 — 대상 노드 확인

`get_metadata(fileKey, nodeId)` 또는 `get_screenshot`으로 무엇을 컴포넌트화할지 확인한다. 노드가 화면 전체처럼 너무 크면, 실제로 컴포넌트화할 하위 노드를 좁혀달라고 사용자에게 요청한다 — 임의로 쪼개지 않는다.

## Step 2 — WDS 대조

1. `docs/conventions/wds-component-usage.md`를 먼저 읽는다. 이미 확정된 매핑이 있으면 재조사 없이 바로 쓴다 — **단, 대상 노드의 실제 스크린샷/스타일이 문서에 기록된 것과 눈에 띄게 다르면(색상·활성 상태 표현 등) 같은 이름이라도 재확인한다.** 파일 전체에서 한 번 확정된 컴포넌트라도 다른 화면에서는 Stream이 로컬로 새로 만든 동명의 요소일 수 있다(사례: `docs/conventions/wds-component-usage.md`의 "빌릴게 필터 Chip은 WDS Chip/Chip이 아니었다" 참고).
2. 대상 노드 안의 인스턴스 중 문서에 없는 이름이 있으면:
   1. `search_design_system`을 WDS libraryKey로 스코프 제한해서 정확한 이름으로 검색한다.
   2. 결과가 애매하면(이름만 비슷하거나 여러 개 매칭) `get_design_context`로 실제 인스턴스 노드를 열어, 응답의 "Component descriptions" 섹션에 나오는 메인 컴포넌트 Node ID·공식 문서 링크(`montage.wanted.co.kr`)로 확정한다.
   3. 새로 확정된 매핑은 `docs/conventions/wds-component-usage.md`의 표에 바로 추가한다 — 이 스킬을 쓸수록 문서가 쌓여서 다음 실행이 더 빨라진다.
3. 매칭도 안 되고 이름도 비슷한 게 없으면 Stream 고유 UI로 취급한다(Step 3-3).

## Step 3 — 코드 생성

1. `get_design_context(fileKey, nodeId)`로 레퍼런스 코드를 받는다.
2. Step 2에서 WDS로 확정된 서브트리는 raw JSX 대신 실제 WDS export로 치환한다.
   - export 이름은 반드시 `node_modules/@wanteddev/wds/dist/components/`에서 실존 여부를 확인한 후 쓴다 — 이름을 추측하지 않는다.
   - 아이콘은 `@wanteddev/wds-icon`에서 가져온다.
   - WDS 컴포넌트 내부를 오버라이드하지 않는다. 레이아웃 조정은 감싸는 wrapper에서 한다.
3. WDS로 확정되지 않은 나머지(Stream 고유 UI)는 `docs/conventions/component-convention.md`를 따라 새 컴포넌트로 작성한다 (파일 구조, variant→Props 유니온 타입 매핑, Figma 노드 추적 주석 등).
4. 이미지·아이콘 asset은 `download_assets`로 받아 `src/assets/`에 커밋한다 — Figma asset URL은 7일 후 만료되므로 그대로 참조하지 않는다.

## Step 4 — 배치 & 검증

1. `docs/conventions/coding-style.md`·`component-convention.md`의 파일 위치 규칙(feature 전용 vs `components/ui/` 공용)에 따라 저장 위치를 정한다. 재사용 범위가 애매하면 사용자에게 확인한다.
2. `pnpm check`(Biome)로 lint/format을 통과시킨다.
3. `component-convention.md`의 "완료 기준 체크리스트"로 스스로 검증한다.

## Step 5 — 결과 안내

- 생성·수정한 파일 경로
- WDS로 대체한 컴포넌트 목록 / 새로 만든 Stream 고유 컴포넌트 목록
- `wds-component-usage.md`에 새로 추가한 매핑이 있으면 그 사실을 짚어준다
