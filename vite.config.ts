import { vitePluginViteNodeMiniflare } from "@hiogawa/vite-node-miniflare";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./workers/app.ts",
        }
      : undefined,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  ssr: {
    target: "webworker",
    noExternal: true,
    external: ["node:async_hooks"],
    resolve: {
      conditions: ["workerd", "browser"],
    },
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/server",
        "react-router",
        "remix-auth",
        "remix-auth-google",
      ],
    },
  },
  plugins: [
    vitePluginViteNodeMiniflare({
      entry: "/workers/app.ts",
      miniflareOptions: (options) => {
        options.compatibilityDate = "2024-11-18";
        options.compatibilityFlags = ["nodejs_compat"];
        options.d1Databases = { DB: process.env.DATABASE_ID as string };
        options.d1Persist = ".wrangler/state/v3/d1";
        options.bindings = {
          ...options.bindings,
          AUTH_SECRET: process.env.AUTH_SECRET as string,
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
          GOOGLE_CALLBACK_BASE_URL: process.env
            .GOOGLE_CALLBACK_BASE_URL as string,
        };
      },
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
}));