/*
 * Define o tema antes da primeira pintura, para a tela não piscar no tema errado.
 * É um script clássico e síncrono no <head>. Precisa ser arquivo externo porque a CSP
 * bloqueia script inline. A troca de tema e o botão ficam em main.js.
 */
(() => {
  const KEY = "eve-theme";
  const COLORS = { light: "#f4ece1", dark: "#16110d" };
  let stored = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    /* armazenamento indisponível: segue o sistema */
  }
  const theme =
    stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COLORS[theme]);
})();
