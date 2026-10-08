import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApi, hiddenGuard } = require("./server/api.js");

const hakdangApi = () => ({
  name: "hakdang-api",
  configureServer(server) {
    server.middlewares.use(hiddenGuard);
    server.middlewares.use(createApi(server.config.root));
  },
});

export default defineConfig({
  plugins: [react(), hakdangApi()],
  server: {
    // 127.0.0.1 에만 연다 — 같은 와이파이의 다른 컴퓨터에서는 내 기록을 볼 수 없다.
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 4321,
    strictPort: true,
    fs: { deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/.agents/**", "**/.claude/**"] },
  },
});
