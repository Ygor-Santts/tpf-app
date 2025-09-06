# TPF Frontend (Vue 3 + Vite + TypeScript)

Frontend Vue 3 integrado ao backend NestJS do projeto **Trampo Fácil**.
Arquitetura organizada por camadas (`domain`, `infra`, `application`, `presentation`) com Pinia, Vue Router e Axios.

## 🧱 Stack
- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vite
- Pinia (state)
- Vue Router
- Axios (HTTP)
- Tailwind (estilo opcional)
- ESLint + Prettier

## 🚀 Rodando
```bash
cp .env.example .env
# ajuste VITE_API_BASE_URL conforme seu backend (ex.: http://localhost:3000)

npm i
npm run dev
```

Acesse: http://localhost:5173

Rotas principais:
- `/login` → POST `/auth/sign-in` (token salvo no localStorage)
- `/register-worker` → POST `/auth/worker/sign-up`
- `/health` → GET `/health-check`

> Se os endpoints diferirem no seu backend, ajuste os paths em `src/infra/services/*`.

## 🧩 Estrutura
```
src
├── application/        # regras de aplicação (stores, casos de uso)
│   └── stores
├── domain/             # contratos e entidades
├── infra/              # serviços de infraestrutura (http, axios, apis)
│   └── services
└── presentation/       # UI (views, router, App.vue, componentes)
    ├── router
    └── views
```

## 🐳 Docker (opcional)
Crie a imagem e suba o front expondo a porta 5173.

```bash
docker build -t tpf-frontend .
docker run --rm -it -p 5173:5173 --env VITE_API_BASE_URL=http://host.docker.internal:3000 tpf-frontend
```

## 🔐 Auth
Um interceptor adiciona `Authorization: Bearer <token>` em todas as requisições quando o token existe no `localStorage`.

## 📦 Ajustes
- Substitua o armazenamento de token por algo mais seguro se necessário.
- Adicione módulos/rotas para marketplace/analytics conforme seu backend.
- Conecte validações de formulário (Zod/Yup) se desejar.
