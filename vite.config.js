import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin"
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix({
      tailwind: true,
      postcss: true,
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
});
