import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from "@remix-run/node";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  plugins: [
    remix(),
    netlifyPlugin(),
    tsconfigPaths(),
  ],
});
