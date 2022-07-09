import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "esnext" },
  define: {
    "process.env": {
      COORDINATOR_HOST: process.env.COORDINATOR_HOST,
      MATCHMAKER_HOST: process.env.MATCHMAKER_HOST,
    },
  },
  server: { host: "0.0.0.0" },
  clearScreen: false,
  resolve: {
    alias: {
      // @sabaki projects use preact but are react compatible
      preact: "react",
    },
  },
});
