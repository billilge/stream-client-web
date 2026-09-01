# stream-client

국민대학교 소프트웨어융합대학 통합 플랫폼 'STREAM' 프론트엔드 (React + TypeScript + Vite).

## 개발 환경

- Node: `.nvmrc` 참고 (`nvm use`)
- 패키지 매니저: [pnpm](https://pnpm.io/) — Corepack으로 관리한다 (`corepack enable` 후 `pnpm install`만 실행하면 `packageManager` 필드에 고정된 버전이 자동으로 쓰인다)

```bash
corepack enable
pnpm install
pnpm dev
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 타입체크 후 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome로 포맷 적용 |
| `pnpm check` | Biome lint + format 검증 |
