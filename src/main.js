import "./styles/main.css";
import { CATEGORIES, EXTRA_CREDITS, POSTS, SONGS } from "./data.js";
import { SIZES, setImage } from "./images.js";

const STORAGE_KEY = "eve-likes";
const BASE_LIKES = 878;

const postsOf = (catId) => POSTS.filter((p) => p.id.startsWith(`${catId}-`));
const categoryOf = (postId) => CATEGORIES.find((c) => postId.startsWith(`${c.id}-`));

/** Clona um <template> e devolve o primeiro elemento. */
function fromTemplate(id) {
  const tpl = /** @type {HTMLTemplateElement} */ (document.getElementById(id));
  return /** @type {HTMLElement} */ (tpl.content.firstElementChild.cloneNode(true));
}

/** Se a imagem falhar, mostra um bloco neutro em vez do ícone quebrado. */
function withFallback(img) {
  img.addEventListener("error", () => img.classList.add("is-broken"), { once: true });
  return img;
}

/* ---------- Curtidas (localStorage é só conveniência; tudo funciona sem ele) ---------- */
const likes = (() => {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {};
  } catch {
    state = {};
  }
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  };
  return {
    has: (id) => Boolean(state[id]),
    set(id, value) {
      state[id] = value;
      save();
    },
    /** Número estável por post, para não mudar a cada visita. */
    count(id) {
      const seed = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      return BASE_LIKES - 120 + (seed % 140) + (state[id] ? 1 : 0);
    },
  };
})();

const fmt = new Intl.NumberFormat("pt-BR");

/* ---------- Render ---------- */
function renderHighlights(root) {
  const items = CATEGORIES.map((cat) => {
    const el = fromTemplate("tpl-highlight");
    el.dataset.category = cat.id;
    el.setAttribute("aria-label", `Ir para ${cat.title}`);
    setImage(withFallback(el.querySelector("img")), `${cat.id}-1`, SIZES.highlight);
    el.querySelector(".highlight__label").textContent = cat.label;
    return el;
  });
  root.replaceChildren(...items);
}

function renderFeed(root) {
  const sections = CATEGORIES.map((cat) => {
    const section = fromTemplate("tpl-section");
    section.id = cat.id;
    section.setAttribute("aria-labelledby", `${cat.id}-title`);
    setImage(withFallback(section.querySelector(".category__thumb")), `${cat.id}-1`, SIZES.thumb);
    const title = section.querySelector(".category__title");
    title.id = `${cat.id}-title`;
    title.textContent = cat.title;
    section.querySelector(".category__desc").textContent = cat.description;

    const tiles = postsOf(cat.id).map((post) => {
      const tile = fromTemplate("tpl-tile");
      tile.dataset.postId = post.id;
      tile.setAttribute("aria-label", `Abrir post: ${post.caption}`);
      const img = withFallback(tile.querySelector("img"));
      setImage(img, post.id, SIZES.tile);
      img.alt = post.alt;
      return tile;
    });
    section.querySelector(".grid").replaceChildren(...tiles);
    return section;
  });
  root.replaceChildren(...sections);
  updateTileCounts();
}

function updateTileCounts() {
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.querySelector(".tile__count").textContent = fmt.format(likes.count(tile.dataset.postId));
  });
}

/** Capa genérica para músicas sem foto correspondente no site. */
function musicCover() {
  const NS = "http://www.w3.org/2000/svg";
  const box = document.createElement("span");
  box.className = "song__cover song__cover--empty";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(NS, "use");
  use.setAttribute("href", "#i-music");
  svg.append(use);
  box.append(svg);
  return box;
}

function renderSongs(root) {
  const items = SONGS.map((song) => {
    const li = fromTemplate("tpl-song");
    const link = /** @type {HTMLAnchorElement} */ (li.querySelector("a"));
    link.href = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
    link.setAttribute("aria-label", `Ouvir ${song.title}, de ${song.artist}, no Spotify`);
    const cover = li.querySelector("img");
    if (song.cover) {
      setImage(withFallback(cover), song.cover, SIZES.cover);
    } else {
      cover.replaceWith(musicCover());
    }
    li.querySelector("strong").textContent = song.title;
    li.querySelector("small").textContent = song.artist;
    return li;
  });
  root.replaceChildren(...items);
}

function renderCredits(root) {
  const lines = [
    ...POSTS.filter((p) => p.credit).map((p) => `${p.id} — ${p.credit}`),
    ...EXTRA_CREDITS,
  ];
  root.replaceChildren(
    ...lines.map((text) => Object.assign(document.createElement("li"), { textContent: text })),
  );
}

/* ---------- Abas (padrão WAI-ARIA Tabs) ---------- */
function initTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];

  const select = (name, { focus = false } = {}) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
      if (active && focus) tab.focus();
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab.dataset.tab));
    tab.addEventListener("keydown", (e) => {
      const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!delta) return;
      const next = tabs[(i + delta + tabs.length) % tabs.length];
      select(next.dataset.tab, { focus: true });
    });
  });

  return select;
}

/* ---------- Modal do post ---------- */
function initModal(dialog) {
  const q = (sel) => dialog.querySelector(sel);
  const img = withFallback(q("[data-post-img]"));
  const thumb = withFallback(q("[data-post-thumb]"));
  const likeBtn = q('[data-action="like"]');
  const pop = q("[data-post-pop]");
  let index = 0;

  const render = () => {
    const post = POSTS[index];
    const cat = categoryOf(post.id);
    img.classList.remove("is-broken");
    setImage(img, post.id, SIZES.post);
    img.alt = post.alt;
    setImage(thumb, `${cat.id}-1`, SIZES.thumb);
    q("[data-post-cat]").textContent = cat.title;
    q("[data-post-caption]").textContent = post.caption;
    q("[data-post-credit]").textContent = post.credit ? `Foto: ${post.credit}` : "";
    renderLike();
  };

  const renderLike = () => {
    const { id } = POSTS[index];
    const liked = likes.has(id);
    likeBtn.setAttribute("aria-pressed", String(liked));
    likeBtn.setAttribute("aria-label", liked ? "Descurtir" : "Curtir");
    const others = fmt.format(likes.count(id) - 1 - (liked ? 1 : 0));
    q("[data-post-likes]").textContent =
      `Curtido por evyn018${liked ? ", você" : ""} e outras ${others} pessoas`;
    updateTileCounts();
  };

  const toggleLike = (force) => {
    const { id } = POSTS[index];
    likes.set(id, force ?? !likes.has(id));
    renderLike();
  };

  const step = (delta) => {
    index = (index + delta + POSTS.length) % POSTS.length;
    render();
  };

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) return dialog.close();
    const action = /** @type {HTMLElement} */ (e.target).closest("[data-action]")?.dataset.action;
    if (action === "close") dialog.close();
    if (action === "prev") step(-1);
    if (action === "next") step(1);
    if (action === "like") toggleLike();
  });

  q("[data-post-media]").addEventListener("dblclick", () => {
    toggleLike(true);
    pop.classList.remove("is-playing");
    void pop.getBoundingClientRect(); // reinicia a animação
    pop.classList.add("is-playing");
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  return {
    open(postId) {
      index = POSTS.findIndex((p) => p.id === postId);
      render();
      if (!dialog.open) dialog.showModal();
    },
  };
}

/* ---------- Efeito "curtir tudo" ---------- */
function burstHearts(count = 24) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const NS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS(NS, "svg");
    const use = document.createElementNS(NS, "use");
    use.setAttribute("href", "#i-heart");
    svg.append(use);
    svg.setAttribute("class", "fly");
    svg.setAttribute("aria-hidden", "true");
    svg.style.left = `${Math.random() * 100}vw`;
    svg.style.setProperty("--dx", `${Math.random() * 160 - 80}px`);
    svg.style.setProperty("--rot", `${Math.random() * 60 - 30}deg`);
    svg.style.setProperty("--size", `${18 + Math.random() * 22}px`);
    svg.style.animationDelay = `${Math.random() * 0.8}s`;
    svg.addEventListener("animationend", () => svg.remove(), { once: true });
    document.body.append(svg);
  }
}

/* ---------- Tema claro/escuro ---------- */
const THEME_KEY = "eve-theme";
const THEME_COLORS = { light: "#f4ece1", dark: "#16110d" };

function initTheme(button) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const storedTheme = () => {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
    button.setAttribute("aria-pressed", String(theme === "dark"));
  };

  apply(storedTheme() ?? (systemDark.matches ? "dark" : "light"));

  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* sem persistência: vale só nesta visita */
    }
    apply(next);
  });

  // Sem escolha salva, acompanha o sistema em tempo real.
  systemDark.addEventListener("change", (e) => {
    if (!storedTheme()) apply(e.matches ? "dark" : "light");
  });
}

/* ---------- Brilhos de fundo ---------- */
const SPARKLE_TONES = ["#d39a4a", "#c8893f", "#e2b878", "#b5503c"];
const random = (min, max) => min + Math.random() * (max - min);

function renderSparkles(root) {
  const NS = "http://www.w3.org/2000/svg";
  // ~1 brilho a cada 110px de altura, com teto para não pesar
  const count = Math.min(70, Math.round(document.documentElement.scrollHeight / 110));

  const items = Array.from({ length: count }, () => {
    const isDot = Math.random() < 0.35;
    const el = isDot ? document.createElement("span") : document.createElementNS(NS, "svg");
    if (isDot) {
      el.className = "sparkle sparkle--dot";
    } else {
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", "#i-sparkle");
      el.append(use);
      el.setAttribute("class", "sparkle");
    }
    const tone = SPARKLE_TONES[Math.floor(Math.random() * SPARKLE_TONES.length)];
    el.style.left = `${random(1, 98)}%`;
    el.style.top = `${random(0.5, 99)}%`;
    el.style.setProperty("--size", `${isDot ? random(3, 6) : random(7, 16)}px`);
    el.style.setProperty("--tone", tone);
    el.style.setProperty("--opacity", random(0.35, 0.75).toFixed(2));
    el.style.setProperty("--duration", `${random(3, 7).toFixed(1)}s`);
    el.style.setProperty("--delay", `${random(0, 6).toFixed(1)}s`);
    return el;
  });
  root.replaceChildren(...items);
}

/* ---------- Bootstrap ---------- */
function init() {
  document.querySelectorAll("img[data-image]").forEach((img) => {
    setImage(withFallback(img), img.dataset.image, img.dataset.sizes ?? SIZES.thumb);
  });
  renderHighlights(document.querySelector("[data-highlights]"));
  renderFeed(document.querySelector("[data-feed]"));
  renderSongs(document.querySelector("[data-songs]"));
  renderCredits(document.querySelector("[data-credits]"));
  document.querySelector("[data-post-count]").textContent = String(POSTS.length);
  renderSparkles(document.querySelector("[data-sparkles]"));
  initTheme(document.querySelector("[data-theme-toggle]"));

  const selectTab = initTabs();
  const modal = initModal(document.querySelector("[data-modal]"));

  document.querySelector("[data-feed]").addEventListener("click", (e) => {
    const tile = /** @type {HTMLElement} */ (e.target).closest(".tile");
    if (tile) modal.open(tile.dataset.postId);
  });

  document.querySelector("[data-highlights]").addEventListener("click", (e) => {
    const btn = /** @type {HTMLElement} */ (e.target).closest(".highlight");
    if (!btn) return;
    selectTab("feed");
    document.getElementById(btn.dataset.category)?.scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("click", (e) => {
    const btn = /** @type {HTMLElement} */ (e.target).closest("[data-action]");
    if (!btn || btn.closest("[data-modal]")) return;

    switch (btn.dataset.action) {
      case "like-all":
        POSTS.forEach((p) => likes.set(p.id, true));
        updateTileCounts();
        burstHearts();
        break;
      case "goto-tab":
        selectTab(btn.dataset.target);
        document.querySelector(".tabs").scrollIntoView({ behavior: "smooth" });
        break;
      case "toggle-dm": {
        const card = document.getElementById("dm-card");
        card.hidden = !card.hidden;
        btn.setAttribute("aria-expanded", String(!card.hidden));
        btn.querySelector(".dm__badge")?.remove();
        break;
      }
    }
  });
}

init();
