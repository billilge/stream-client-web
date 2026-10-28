import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 접두사 없이 읽는다 — API_PROXY_TARGET은 개발 서버만 쓰는 값이라 VITE_를 붙여 번들에 넣지 않는다
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      // 서버에 CORS 설정이 없어서 브라우저가 다른 주소로 가는 요청을 막는다.
      // 개발 서버가 같은 주소의 `/v1/...`를 받아 서버로 넘겨서 브라우저에는 같은 주소 요청으로 보이게 한다.
      proxy: env.API_PROXY_TARGET
        ? {
            "/v1": { target: env.API_PROXY_TARGET, changeOrigin: true },
          }
        : undefined,
    },
  };
});
