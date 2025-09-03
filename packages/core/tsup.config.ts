import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/globals.css"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client"',
  },
});
