/**
 * Conteúdo do site. Para trocar textos ou fotos, edite só este arquivo.
 * Cada post corresponde a /assets/img/<id>.jpg.
 */

/** @typedef {{ id: string, label: string, title: string, description: string }} Category */
/** @typedef {{ id: string, caption: string, alt: string, credit: string }} Post */
/** @typedef {{ title: string, artist: string, cover?: string }} Song */

/** @type {Category[]} */
export const CATEGORIES = [
  {
    id: "bts",
    label: "BTS",
    title: "BTS",
    description:
      "Borahae. Sim, ela sabe diferenciar entre os sete. Mas o favorito é o Suga, eu acho, quem sabe diferenciar é ela e não eu.",
  },
  {
    id: "cafe",
    label: "Cafés",
    title: "Cafés caros e chiques",
    description: "Se o cappuccino custa menos de R$ 25, ela desconfia e nem entra no restaurante.",
  },
  {
    id: "chocolate",
    label: "Chocolate",
    title: "Chocolates",
    description: "Um chocolatinho depois de um dia longo (ou logo depois do almoço).",
  },
  {
    id: "elis",
    label: "Elis",
    title: "Elis Regina",
    description:
      "A Elis é a Elis e o resto é resto. E ela sabe diferenciar entre as vozes, mas a favorita é a Elis.",
  },
  {
    id: "dorama",
    label: "Doramas",
    title: "Doramas",
    description:
      "“Só mais um episódio.” São 3h da manhã, episódio 14. Será que a protagonista vai ficar com o colega de trabalho ou com o amigo de infância?",
  },
  {
    id: "mpb",
    label: "MPB",
    title: "MPB",
    description:
      "Cazuza, Gil, Gal, Chico. A MPB acompanha a semana inteira, inclusive nos stories.",
  },
  {
    id: "sp",
    label: "SP",
    title: "São Paulo",
    description:
      "Garoa, Paulista e um passeio chique em cada esquina. Só tome cuidado com os assaltantes que saem do matagal.",
  },
  {
    id: "role",
    label: "Rolês",
    title: "Rolês pelo mundo",
    description: "AR, UY, SC… o aeroporto (e a rodoviária) também curtiram isso.",
  },
];

/** @type {Post[]} */
export const POSTS = [
  {
    id: "bts-1",
    caption: "eu e meu coração em Wembley (em espírito)",
    alt: "BTS em show no Estádio de Wembley",
    credit: "NenehTrainer — CC BY 3.0",
  },
  {
    id: "bts-2",
    caption: "DNA tocando = eu perco o juízo",
    alt: "BTS cantando DNA na turnê Love Yourself",
    credit: "I DARE U JK — CC BY 3.0",
  },
  {
    id: "bts-3",
    caption: "os sete e a minha paz de espírito",
    alt: "BTS no show The Red Bullet em Taipei",
    credit: "Heavenly Moment 97 — CC BY 4.0",
  },
  {
    id: "cafe-1",
    caption: "cafezinho chique pra fingir que sou rica",
    alt: "Interior elegante de uma pâtisserie",
    credit: "Marsupium — CC BY 4.0",
  },
  {
    id: "cafe-2",
    caption: "o croissant mais caro da minha vida e eu faria de novo",
    alt: "Salão de chá e pâtisserie em Lyon",
    credit: "Benoît Prieur — CC0",
  },
  {
    id: "cafe-3",
    caption: "latte art > qualquer coisa",
    alt: "Cappuccino com latte art",
    credit: "Drew Coffman — CC0",
  },
  {
    id: "chocolate-1",
    caption: "vitrine me chamando pelo nome",
    alt: "Trufas Godiva na vitrine",
    credit: "M0tty — CC BY-SA 3.0",
  },
  {
    id: "chocolate-2",
    caption: "uma caixinha só pra mim, obrigada",
    alt: "Caixa de trufas e pralinés",
    credit: "Schnäggli — CC BY-SA 3.0",
  },
  {
    id: "chocolate-3",
    caption: "um bombom por dia (ou cinco)",
    alt: "Pralinés finos numa confeitaria",
    credit: "Marek Ślusarczyk — CC BY 3.0",
  },
  {
    id: "elis-1",
    caption: "Elis é Elis e o resto é resto",
    alt: "Elis Regina em 1970",
    credit: "Autor desconhecido — Domínio público",
  },
  {
    id: "elis-2",
    caption: "a voz que arrepia até a alma",
    alt: "Elis Regina em 1965",
    credit: "Autor desconhecido — Domínio público",
  },
  {
    id: "elis-3",
    caption: "“Como Nossos Pais” no repeat",
    alt: "Elis Regina em 1969",
    credit: "Autor desconhecido — Domínio público",
  },
  {
    id: "dorama-1",
    caption: "me vejo andando aqui em cena de dorama",
    alt: "Casas hanok em Bukchon, Seul, na hora azul",
    credit: "Basile Morin — CC BY-SA 4.0",
  },
  {
    id: "dorama-2",
    caption: "cadê meu cadeado de amor na torre?",
    alt: "Torre N Seoul",
    credit: "Eugene Lim — CC BY 2.0",
  },
  {
    id: "dorama-3",
    caption: "episódio final com cerejeira = chorei",
    alt: "Cerejeiras em flor no lago Seokchon, Seul",
    credit: "Ox1997cow — CC BY-SA 3.0",
  },
  {
    id: "mpb-1",
    caption: "Cazuza no volume máximo, sem pedir desculpa",
    alt: "Cazuza cantando em show, em 1987",
    credit: "Autor desconhecido — Domínio público",
  },
  {
    id: "mpb-2",
    caption: "Gil num domingo de paz absoluta",
    alt: "Gilberto Gil",
    credit: "simenon — CC BY-SA 2.0",
  },
  {
    id: "mpb-3",
    caption: "Gal sendo Gal, sem pedir licença",
    alt: "Gal Costa em show",
    credit: "Teca Lamboglia — CC BY 2.0",
  },
  {
    id: "sp-1",
    caption: "domingo de Paulista e MASP, sou eu",
    alt: "MASP na Avenida Paulista, São Paulo",
    credit: "Wilfredor — CC0",
  },
  {
    id: "sp-2",
    caption: "o Copan e suas curvas",
    alt: "Edifício Copan em São Paulo",
    credit: "Pablo Trincado — CC BY 2.0",
  },
  {
    id: "sp-3",
    caption: "Ibira com piquenique é o plano perfeito",
    alt: "Parque Ibirapuera em São Paulo",
    credit: "Wilfredor — CC0",
  },
  {
    id: "role-1",
    caption: "Caminito colorido, meu feed agradece",
    alt: "Caminito, em La Boca, Buenos Aires",
    credit: "Luis Argerich — CC BY 2.0",
  },
  {
    id: "role-2",
    caption: "Puerto Madero, me leva de volta?",
    alt: "Puente de la Mujer em Puerto Madero, Buenos Aires",
    credit: "Mariordo — CC BY-SA 4.0",
  },
  {
    id: "role-3",
    caption: "Colonia del Sacramento, onde até a rua tem charme",
    alt: "Rua de pedra no Barrio Histórico de Colonia del Sacramento, descendo até o rio",
    credit: "Javier Vidal — CC BY 2.0",
  },
];

/** Créditos de imagens que não são posts. */
export const EXTRA_CREDITS = [
  "suga-avatar — Dispatch — CC BY 3.0",
  "song-mf-doom — Possan — CC BY-SA 3.0",
  "song-tom-jobim — Autor desconhecido — Domínio público",
  "song-cazuza — Autor desconhecido — Domínio público",
  "song-arthur-verocai — brun-o (Flickr) — CC BY-NC-SA 2.0",
  "song-rita-lee — CaioWebb — CC BY 2.0",
  "song-fito-paez — Ministerio de Cultura de la Nación — CC BY-SA 2.0",
];

/** Links abrem a busca do Spotify (sem IDs fixos que podem quebrar). @type {Song[]} */
export const SONGS = [
  { title: "Madalena", artist: "Elis Regina", cover: "elis-3" },
  { title: "Swim", artist: "BTS", cover: "bts-1" },
  { title: "Licorice", artist: "MF DOOM", cover: "song-mf-doom" },
  { title: "Águas de Março", artist: "Tom Jobim", cover: "song-tom-jobim" },
  { title: "Nuvem Negra", artist: "Gal Costa", cover: "mpb-3" },
  { title: "Boa Vida", artist: "Cazuza", cover: "song-cazuza" },
  { title: "Dynamite", artist: "BTS", cover: "bts-3" },
  { title: "Caboclo", artist: "Arthur Verocai", cover: "song-arthur-verocai" },
  { title: "Mutante", artist: "Rita Lee", cover: "song-rita-lee" },
  { title: "11 y 6", artist: "Fito Páez", cover: "song-fito-paez" },
];
