# Coding Style

> TypeScript/React 코드 작성 시 지키는 공통 컨벤션.

## TypeScript

- `strict: true`. `any` 금지 — 불가피하면 `unknown` + 좁히기.
- 컴포넌트 props·외부에 노출하는 함수는 타입을 명시한다. 내부 지역 변수는 추론에 맡긴다.
- **객체 형태(컴포넌트 Props 등)는 `interface`**, `type`이어야만 하는 것(유니온·유틸리티 조합·별칭·조건부 타입)만 `type`으로 쓴다.
  - 근거: TS 공식 핸드북의 휴리스틱 — *"use `interface` until you need to use features from `type`"*.
  - 참고: [Handbook — Type Aliases vs Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

## 네이밍

- 컴포넌트 파일/이름: PascalCase (`UserCard.tsx`).
- 훅: `useXxx`. 일반 함수/변수: camelCase. 상수: `UPPER_SNAKE_CASE`.
- 불리언: `is` / `has` / `should` 접두사.
- 폴더: 도메인명 소문자 또는 kebab-case.
- **도메인 이름은 임의로 번역/축약하지 않는다.** `features/<기능>/` 폴더명, 라우트 경로, 도메인 접두사가 붙는 컴포넌트/타입명은 `docs/conventions/terminology.md`(용어 사전)의 코드 용어를 그대로 쓴다 — 백엔드 API 엔드포인트 네이밍과 맞추기 위함이다. 사전에 없는 새 도메인이면 먼저 그 문서에 추가한 뒤 코드에 반영한다.

## 폴더 구조

- 기능 기반(feature-based) 구조를 쓴다. `app/`(라우팅 껍데기)·`components/ui/`(공용 UI)·`hooks/`·`lib/`·`utils/`·`constants/`는 실제로 내용이 생길 때 만든다 — 빈 폴더를 미리 만들지 않는다.
- 화면 단위 기능이 생기면 `features/<기능>/`, 여러 화면이 공유하는 서버 계약(API·쿼리·타입)이 생기면 `entities/<도메인>/`을 그때 도입한다.
- import는 절대경로 `@/`(`./src/*`)를 쓴다. 상대경로는 같은 기능 폴더 내부에서만.
- 그룹 순서: ① 외부 라이브러리 → ② `@/` → ③ 상대경로. 저장 시 Biome의 `organizeImports`가 자동 정렬한다.

## 라우팅

- 라우트는 `src/app/router.tsx`의 **객체 배열 한곳**에서 `createBrowserRouter`로 정의하고, `satisfies RouteObject[]`로 형태를 검사한다. JSX `<Routes>`/`<Route>`로 선언하지 않는다 — 화면별 옵션(`handle`)을 선언 시점에 타입 검사하기 위해서다.
- 새 화면은 `ScreenLayoutRoute` 레이아웃 라우트의 `children`에 추가한다. 옵션이 다른 화면이 생겨도 **레이아웃 라우트를 따로 선언하지 않는다**(따로 두면 화면을 오갈 때 레이아웃이 다시 마운트된다).
- 화면별 레이아웃 옵션은 라우트 `handle`에 `satisfies ScreenRouteHandle`로 지정한다. 오타(`hasBottomnav` 등)는 타입 검사에서 걸린다.

  ```tsx
  {
    element: <EventsApplicationScreen />,
    handle: { hasBottomNav: false } satisfies ScreenRouteHandle,
    path: "/events/:eventId/apply",
  }
  ```

  새 옵션이 필요하면 `src/app/ScreenLayoutRoute.tsx`의 `ScreenRouteHandle`에 필드를 추가하고, 그 값을 `ScreenLayout` prop으로 넘긴다. 현재 필드는 `hasBottomNav`(하단 탭 표시)와 `background`(375×812 프레임 배경 — 헤더 뒤까지 포함이라 화면 본문에서 칠할 수 없다. 신청 완료처럼 Figma가 흰 배경으로 그린 화면만 `"normal"`)다.
- `ScreenLayout`은 **라우터를 모르는 prop 기반 컴포넌트**로 유지한다. 라우트 정보(`useMatches`)는 `ScreenLayoutRoute`만 읽는다.
- 화면 스택을 쌓는 이동(목록→상세, 상세→신청 등)은 `navigate(to, { viewTransition: true })`·`<Link viewTransition>`으로 슬라이드 전환을 켠다. 뒤로가기는 react-router가 그 이동을 기억해 반대 방향으로 자동 적용하므로 `navigate(-1)`은 그대로 둔다. 브라우저 앞으로가기도 POP이라, `ScreenLayoutRoute`는 히스토리 위치(`history.state.idx`)가 줄어든 POP만 뒤로 방향으로 본다. Bottom Nav·상단 탭처럼 형제 화면을 오가는 이동과 홈으로 돌아가는 이동은 켜지 않는다(즉시 전환). 애니메이션은 `index.css`, 방향은 `ScreenLayoutRoute`가 정한다.
- 라우트가 없는 경로는 레이아웃 안의 `path: "*"` 라우트(`ComingSoonScreen`)가 받는다. 하단 탭이 유지돼서 다른 화면으로 돌아갈 수 있다. 구체적인 경로가 `*`보다 항상 우선하므로 배열 순서는 신경 쓰지 않아도 된다.

## 데이터 로딩

- 서버 데이터는 TanStack Query로 받는다. API 함수·쿼리·타입은 `entities/<도메인>/`에 두고(`<도메인>Api.ts`·`<도메인>Queries.ts`·`types.ts`), 화면은 `useSuspenseQuery(<도메인>Queries.list())`처럼 쿼리 팩토리로만 받는다.
- 실 API 전까지 API 함수는 `<도메인>Mock.ts`의 목데이터를 `mockResponse`(`lib/mockResponse.ts`)로 돌려준다. 개발 서버에서는 스켈레톤을 확인할 수 있게 500ms 늦게 응답하고, 배포 빌드에서는 바로 응답한다. API가 붙으면 API 함수 안쪽만 바꾼다.
- 화면(`<화면>Screen.tsx`)은 헤더 등록, UI 상태, 이동 같은 동작을 맡고, 데이터를 받는 영역만 `<Suspense fallback={<전용 스켈레톤 />}>`으로 감싼다. `useSuspenseQuery`를 부르고 데이터를 그리는 부분은 `features/<기능>/components/`의 컴포넌트(`EventsList`, `EventsDetailContent` 등)로 분리하고, 이동 같은 동작은 콜백 prop으로 받는다.
- 데이터와 무관한 헤더·탭·필터는 Suspense 밖에서 바로 그리고, 스켈레톤은 데이터 영역의 배치만 따라 그린다. 전용 스켈레톤은 `features/<기능>/components/<화면>Skeleton.tsx`에 두고 WDS `Skeleton`으로 그린다. 헤더가 데이터에 따라 달라지는 화면(공지 상세)은 헤더도 데이터 컴포넌트가 등록하고, 스켈레톤이 `useScreenHeaderSkeleton`으로 헤더 자리를 채운다.

## 에러 / 비동기

- async는 try/catch 또는 TanStack Query의 에러 상태로 다룬다. **빈 catch 금지**.
- 사용자에게 보이는 메시지와 개발 로깅을 구분한다.

## 주석

- "왜"를 적는다. "무엇"은 코드로 드러나게 한다.
- 주변 코드의 주석 밀도·언어를 따른다. 불필요한 주석 금지.

## Lint · Format

- **Biome 단일 도구**로 lint + format + import 정리. ESLint/Prettier는 쓰지 않는다.
- `pnpm check` — 검증만 (커밋·PR 전).
- `pnpm check:fix` — 자동 수정 + 포맷.
- 설정·룰셋: `biome.jsonc` 참고.

## 금지

- `console.log` 커밋 금지 (디버깅 후 제거; `console.info`/`warn`/`error`는 허용 — `biome.jsonc`의 `noConsole` 참고).
- 주석 처리된 죽은 코드 커밋 금지.
- 동일 기능 중복 구현 금지 — 새로 만들기 전에 기존 코드부터 검색한다.
