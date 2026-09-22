# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:24-alpine AS build
WORKDIR /app

# package.json의 packageManager 필드에 고정된 pnpm 버전 사용
RUN corepack enable

# 의존성 캐시 최적화를 위해 매니페스트 먼저 복사
COPY package.json pnpm-lock.yaml .npmrc ./

# @wanteddev 패키지는 GitHub Packages 사설 레지스트리에서 받으므로 인증 토큰 필요.
# BuildKit secret으로 주입하고, 같은 RUN 안에서 .npmrc를 원복해 토큰이 레이어에 남지 않도록 한다.
RUN --mount=type=secret,id=node_auth_token \
    cp .npmrc .npmrc.bak && \
    printf '\n//npm.pkg.github.com/:_authToken=%s\n' "$(cat /run/secrets/node_auth_token)" >> .npmrc && \
    pnpm install --frozen-lockfile && \
    mv .npmrc.bak .npmrc

COPY . .
RUN pnpm build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
