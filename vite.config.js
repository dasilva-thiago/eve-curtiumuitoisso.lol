import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = import.meta.dirname;

export default defineConfig({
  build: {
    target: "es2022",
    // Arquivos em /assets/ saem com hash no nome e recebem cache imutável (ver public/_headers).
    assetsDir: "assets",
    // Imagens nunca viram base64 dentro do JS: cada uma é um arquivo com cache próprio
    // e o navegador só baixa as que aparecem na tela (loading="lazy" + srcset).
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        notFound: resolve(root, "404.html"),
      },
    },
  },
});
