/**
 * Mapa de imagens otimizadas: id → variantes WebP com hash.
 * Os arquivos são gerados por `npm run images` (scripts/optimize-images.mjs)
 * no formato src/assets/img/<id>-<largura>.webp.
 */
const files = import.meta.glob("./assets/img/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

/** @type {Map<string, { width: number, url: string }[]>} */
const variants = new Map();

for (const [file, url] of Object.entries(files)) {
  const match = /\/([^/]+)-(\d+)\.webp$/.exec(file);
  if (!match) continue;
  const [, id, width] = match;
  const list = variants.get(id) ?? [];
  list.push({ width: Number(width), url: /** @type {string} */ (url) });
  variants.set(id, list);
}
variants.forEach((list) => list.sort((a, b) => a.width - b.width));

/**
 * Aplica src/srcset/sizes de uma foto a um <img>.
 * @param {HTMLImageElement} img
 * @param {string} id      ex.: "bts-1"
 * @param {string} sizes   largura exibida, ex.: "84px" ou "(max-width: 735px) 33vw, 300px"
 */
export function setImage(img, id, sizes) {
  const list = variants.get(id);
  if (!list) {
    img.classList.add("is-broken");
    return;
  }
  img.sizes = sizes;
  img.srcset = list.map((v) => `${v.url} ${v.width}w`).join(", ");
  img.src = list.at(-1).url;
}

/** Larguras exibidas de cada tipo de imagem (casam com o CSS). */
export const SIZES = {
  tile: "(max-width: 735px) 33vw, 300px",
  post: "(max-width: 735px) 100vw, 680px",
  highlight: "84px",
  avatar: "150px",
  thumb: "44px",
  cover: "48px",
};
