# Promise.9-Web 참고 초기 설정 정비

> 관련 이슈: 없음 (계획 단계)
> 작성일: 2026-09-02

## 배경 / 목표

stream-client는 Vite 템플릿을 그대로 생성한 상태라 lint/format, 에디터 설정, 경로 별칭, 폴더 구조가 모두 기본값이다.
[mash-up-kr/Promise.9-Web](https://github.com/mash-up-kr/Promise.9-Web)은 같은 React+TypeScript 스택을 쓰면서 이미 초기 설정이 정리된 참고 프로젝트라, 그중 우리 서비스에 반영할 것을 골라 적용한다.

다만 Promise.9-Web은 **Expo(React Native)+웹+크롬 익스텐션 3개 표면을 공유하는 링크 저장 서비스**다. RN/Expo/NativeWind, 멀티 서페이스용 `shared/`·`extension/` 구조는 stream-client(순수 웹 SPA)에 맞지 않아 제외한다. Tailwind CSS는 stream-client에서도 쓰기로 했으므로, RN 대응 없는 **순수 웹용 Tailwind v4**로 별도 도입한다.

완료 기준: ESLint 대신 Biome 하나로 lint+format+import 정리가 돌아가고, `@/*` 경로 별칭·기본 폴더 구조·코딩 컨벤션 문서가 갖춰지고, Tailwind CSS와 디자인 시스템을 나중에 채워 넣을 수 있는 자리(토큰 위치·컴포넌트 폴더)가 마련된 상태.

## 범위

**포함**
- npm → pnpm 전환 (`package-lock.json` → `pnpm-lock.yaml`)
- ESLint → Biome 전환 (lint + format + import 정리 단일화)
- `.nvmrc`로 Node 버전 고정
- `tsconfig`/`vite.config.ts` 경로 별칭(`@/*` → `./src/*`) 추가
- 기본 폴더 구조 정비 (feature-based, 실제 도메인 생기기 전까지는 뼈대만)
- Tailwind CSS v4 도입 (`@tailwindcss/vite` 플러그인 방식, 순수 웹이라 postcss 없이 가능)
- 디자인 시스템 초기 스캐폴딩 — 실제 컴포넌트는 아직 없고, 토큰을 넣을 자리(`@theme`)와 컴포넌트가 들어갈 폴더(`components/ui/`)만 마련
- Biome 설정에 Tailwind 대응 추가 (`css.parser.tailwindDirectives`, `nursery.useSortedClasses` 클래스 정렬 규칙)
- `docs/conventions/coding-style.md` 추가 (TS strict, 네이밍, import 순서, 금지 규칙 등 — Promise.9-Web `shared.md`에서 RN/멀티서페이스 부분 제외하고 이식)
- PR 리뷰어 자동 지정 GitHub Action (`review-assign.yml`) 이식

**포함하지 않음**
- `.vscode/` 에디터 설정 — 팀에서 WebStorm을 쓰므로 VSCode 전용 설정은 불필요. WebStorm은 Biome 플러그인이 `biome.jsonc`를 자동 인식하고, IDE 설정(`.idea/`)은 이미 `.gitignore`에 있어 커밋할 파일도 없음
- Expo/React Native/NativeWind — stream-client는 순수 웹이라 해당 없음
- `shared/`·`extension/` 멀티 서페이스 구조 — 단일 웹 서비스라 해당 없음
- 디자인 시스템의 실제 컴포넌트·토큰 값 — 아직 디자인이 확정되지 않아 자리만 마련하고 내용은 채우지 않음
- Jest/Playwright/Maestro 등 테스트 인프라 도입 — AGENTS.md 작업 원칙상 테스트는 명시적 요청 시에만 진행
- wrangler/Cloudflare 배포 설정 — 배포 대상 미정, 이 프로젝트와 무관할 가능성이 높음

## 영향 범위 / 관련 컴포넌트

- `package-lock.json` 삭제, `pnpm-lock.yaml` 신규 생성 (`pnpm import` 또는 재설치로 생성), `packageManager` 필드를 `package.json`에 추가
- `package.json` — eslint 계열 devDependencies 제거, `@biomejs/biome` 추가, `lint`/`format`/`check` 스크립트 변경, `tailwindcss`/`@tailwindcss/vite` 추가
- `eslint.config.js` 삭제, `biome.jsonc` 신설 (CSS 파서 `tailwindDirectives: true`, CSS 린터 비활성화, `nursery.useSortedClasses` 클래스 정렬 규칙 포함)
- `tsconfig.app.json` — `baseUrl`/`paths`(`@/*` → `./src/*`) 추가
- `vite.config.ts` — `resolve.alias`로 동일한 `@/*` 별칭 추가 (tsconfig의 `paths`는 타입 체크에만 쓰이고 번들러엔 별도 반영이 필요함), `@tailwindcss/vite` 플러그인 등록
- `.nvmrc` 신설
- `src/` 폴더 재구성 — 현재 `App.tsx`/`App.css`/`main.tsx`/`index.css`를 정리된 구조로 이동, `App.css`의 Vite 기본 스타일은 Tailwind 도입으로 제거
- `src/index.css` — `@import "tailwindcss";` + 디자인 토큰을 넣을 빈 `@theme { }` 블록 추가 (Tailwind v4는 CSS 기반 설정이라 `tailwind.config.js` 불필요)
- `src/components/ui/` — 디자인 시스템 컴포넌트가 들어갈 자리 (기본 폴더 구조 정비에 포함, 내용은 비워둠)
- `docs/conventions/coding-style.md`, `docs/conventions/00-index.md`(있으면 갱신, 없으면 필요 시 신설) — [[stream-client 컨벤션 인덱스]]
- `.github/workflows/review-assign.yml` 신설

## 구현 계획

1. [x] chore: npm → pnpm 전환 — `package-lock.json` 삭제, `pnpm install`로 `pnpm-lock.yaml` 생성, `packageManager` 필드 추가, README에 `pnpm` 사용 안내 (다른 커밋들이 전제하므로 가장 먼저 진행)
2. [x] chore: Node 버전 고정 — `.nvmrc` 추가
3. [x] chore: ESLint 제거, Biome 도입 — `biome.jsonc`, `package.json` scripts/deps
4. [x] chore: 경로 별칭(`@/*`) 추가 — `tsconfig.app.json` paths + `vite.config.ts` resolve.alias (TS 6.x에서 `baseUrl`이 deprecated라 `paths`만 사용)
5. [x] refactor: 기능 기반 폴더 구조로 `src/` 정비 — 실행 중 계획 수정: git은 빈 디렉터리를 추적하지 못하고, Promise.9-Web의 "빈 폴더 미리 만들지 않기" 원칙과도 맞지 않아 `components/ui/`·`hooks/`·`lib/`·`utils/`·`constants/`는 만들지 않음. 실제 내용이 있는 `app/`(App.tsx 이동)만 먼저 만들고, 나머지는 첫 필요 시점에 생성. 겸사겸사 Vite 템플릿 데모 콘텐츠(로고·카운터 등)와 미사용 자산(`assets/*`, `public/icons.svg`) 정리.
6. [ ] chore: Tailwind CSS v4 도입 — `@tailwindcss/vite` 설치·플러그인 등록, `index.css`에 `@import "tailwindcss"` + 빈 `@theme` 블록, 기본 Vite 스타일 정리, Biome에 Tailwind 클래스 정렬·CSS 파서 설정 추가
7. [ ] docs: `coding-style.md` 컨벤션 문서 추가
8. [ ] chore: PR 담당자 자동 지정 GitHub Action 추가 (`reviewers`는 비워두고 `assignees`만 적용, 팀원 아이디 정해지면 추가)

## API 연동 / 외부 의존성 (해당 시)

해당 없음 — 초기 설정(tooling) 범위이며 백엔드 연동은 별도 작업.

## 결정 필요 사항 / 리스크

- **Biome 포맷 스타일**: Promise.9-Web은 double quote·세미콜론 항상·trailing comma all·line width 80을 쓴다. 이번 계획은 이 스타일을 그대로 따르는 것으로 가정했다 — 다른 취향이 있으면 확인 필요.
- **폴더 구조 시점**: Promise.9-Web의 `entities/`·`features/`는 실제 도메인(링크·폴더 등)이 있어서 나온 구조다. stream-client는 아직 도메인 코드가 없으므로, 이번 계획에서는 `entities/`·`features/`를 미리 만들지 않고 `app/`·`components/ui/`·`hooks/`·`lib/`·`utils/`만 뼈대로 잡는 쪽으로 결정했다 (Promise.9-Web도 "빈 폴더 미리 만들지 않기" 원칙). 첫 도메인 기능을 추가할 때 `entities/`·`features/`를 그때 붙이는 것을 제안한다 — 동의하는지 확인 필요.
- **PR 리뷰어 계정**: `review-assign.yml`의 `reviewers` 값은 Promise.9-Web 팀원 GitHub 아이디가 하드코딩돼 있다. 일단 비워두고(assignee 자동 지정만 적용) 팀원 아이디가 정해지면 채우는 것으로 결정.
- **디자인 시스템 구현 방식**: 자체 컴포넌트를 처음부터 만들지, shadcn/ui 같은 헤드리스 라이브러리를 기반으로 할지는 아직 미정. 이번 계획에서는 `components/ui/` 자리와 Tailwind `@theme` 토큰 자리만 마련하고, 실제 컴포넌트·토큰 값 채우기는 디자인이 확정된 뒤 별도 계획으로 진행하는 것을 제안한다.
- **`tailwind-merge`/`cva`류 클래스 병합 유틸리티 도입 여부**: 조건부 Tailwind 클래스가 많아지면 필요해지는데, 지금은 컴포넌트가 없어 판단 보류. 필요해지는 시점에 결정.
