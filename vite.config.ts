/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ReactCompilerConfig = {
  target: "19",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/__tests__/setupTest.ts"],
  },
});
