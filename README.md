# Site Lembrete — Vite

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo desenvolvimento
npm run dev
```

## Build para hospedagem (Vercel / Netlify)

```bash
npm run build
```

## Páginas (atende o requisito de 7 rotas do professor)

| Rota | Tela |
|------|------|
| `/login` | Login |
| `/cadastro` | Cadastro |
| `/` | Home / Dashboard |
| `/criar` | Criar lembrete |
| `/lembrete/:id` | Detalhes e edição |
| `/listas` | Gerenciar listas |
| `/busca` | Buscar lembretes |
| `/lixeira` | Lixeira |
| `/perfil` | Perfil do usuário |

## Conectar ao back end

Em `src/context/AuthContext.jsx`, descomente as linhas da API:
```js
const API_URL = 'http://IP_DO_SERVIDOR:3000';
```

## Estrutura do projeto

```
SiteLembrete/
├── index.html              ← raiz (diferença do Vite)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx            ← entry point (diferença do Vite)
    ├── App.jsx
    ├── global.css
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── LembretesContext.jsx
    │   ├── ListasContext.jsx
    │   └── TemaContext.jsx
    ├── components/
    │   ├── Layout.jsx
    │   └── LembreteCard.jsx
    └── pages/
        ├── Auth/
        ├── Home/
        ├── Lembrete/
        ├── Listas/
        ├── Busca/
        ├── Lixeira/
        └── Perfil/
```
