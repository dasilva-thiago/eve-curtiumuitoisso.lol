# eve-curtiumuitoisso.lol

Site estático "Eve curtiu isso!", hospedado no **Cloudflare Workers (Static Assets)**.
Não tem build: o que está em `public/` é o que vai para o ar.

## Estrutura

```
public/                 # raiz publicada
  index.html            # marcação + <template>s + sprite de ícones SVG
  404.html
  _headers              # CSP, headers de segurança, cache
  robots.txt, favicon.svg
  assets/
    css/main.css        # tokens + componentes (BEM)
    js/data.js          # CONTEÚDO: categorias, legendas, playlist
    js/main.js          # renderização e interações (ES module)
    img/                # <categoria>-<n>.jpg + CREDITS.md
wrangler.jsonc          # config do Cloudflare
```

## Editar conteúdo

- Textos, legendas e playlist ficam em `public/assets/js/data.js`.
- Para trocar uma foto, substitua `public/assets/img/<id>.jpg` (JPEG com ~900px de largura) e atualize o `credit`.
- A foto de perfil fica em `public/assets/img/eve-avatar.jpg` (320×320).

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:8787
npm run check    # eslint + prettier
```

## Deploy

1. Adicione o domínio `eve-curtiumuitoisso.lol` como zona na sua conta Cloudflare e aponte os nameservers no registrador.
2. Rode `npx wrangler login` e depois `npm run deploy`. A rota `custom_domain` em `wrangler.jsonc` cria o DNS e o certificado sozinha.
3. (Opcional) Para o `www`, crie uma _Redirect Rule_ no painel: `www.eve-curtiumuitoisso.lol/*` → `https://eve-curtiumuitoisso.lol/${1}` (301).

Também dá para fazer deploy contínuo: em Workers & Pages → _Import a repository_, conecte este repo com o comando de deploy `npx wrangler deploy`.
