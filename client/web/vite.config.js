import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // @sabaki projects use preact but are react compatible
      preact: "react",
    },
  },
});
