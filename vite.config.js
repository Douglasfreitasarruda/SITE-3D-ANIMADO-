import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyModelAssets() {
  return {
    name: "copy-model-assets",
    closeBundle() {
      const fileName = "sewing-machine-web-draco.glb";
      const source = resolve("assets", "models", "sewing-machine", fileName);
      const destinationDirectory = resolve(
        "dist",
        "assets",
        "models",
        "sewing-machine",
      );

      if (existsSync(source)) {
        mkdirSync(destinationDirectory, { recursive: true });
        cpSync(source, resolve(destinationDirectory, fileName));
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [copyModelAssets()],
});
