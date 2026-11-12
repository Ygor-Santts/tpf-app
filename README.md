# Trampo Fácil: app

App do **Trampo Fácil**, que liga quem precisa de um serviço (pedreiro, eletricista, diarista, jardineiro...) a profissionais da mesma região. Funciona no celular e no computador, pelo navegador, e está no ar em [app-trampofacil.com.br](https://app-trampofacil.com.br).

Feito com [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), [Tailwind](https://tailwindcss.com/), [Pinia](https://pinia.vuejs.org/), Vue Router e vue-i18n. Usa a API do [tpf-api](https://github.com/Ygor-Santts/tpf-api).

📘 **Visão geral do sistema** (os três repositórios, servidor, regras de negócio e pendências): [tpf-api/docs/ARQUITETURA.md](https://github.com/Ygor-Santts/tpf-api/blob/main/docs/ARQUITETURA.md)

---

## ✨ O que o app faz

- **Visitante** navega sem conta: início, busca, categorias, perfis, portfólio e avaliações. Para ver o telefone, cria uma conta grátis.
- **Cliente** busca por região (raio de 10, 30 ou 50 km pela localização, ou por estado e cidade), por categoria e profissão, e chama o profissional no WhatsApp ou liga. Também avalia o profissional.
- **Trabalhador** monta o perfil (profissões, cidades, bio), o portfólio de fotos e vídeos, acompanha o painel e as avaliações, e sugere a categoria ou profissão que falta (fica "em análise" até um admin aprovar).
- Uma conta pode ser **cliente e trabalhador** ao mesmo tempo, alternando entre os modos.
- **Destaque** (pago, selo e topo da busca) e **Melhores no ramo** (ranking grátis de quem tem 3 ou mais avaliações).
- **Tutorial** na primeira visita, página **Como funciona** e tela **Ajuda e suporte** com perguntas frequentes e formulário.
- Cadastro com validação por campo em português, nome e sobrenome, e-mail confirmado por link, recuperação de senha, exclusão da conta e Política de Privacidade.
- Português (padrão) e inglês.

## 🗺️ Telas

| Endereço | Tela | Quem acessa |
| --- | --- | --- |
| `/tabs/home` | Início | Todos |
| `/tabs/como-funciona` | Como funciona | Todos |
| `/tabs/categories`, `/tabs/categories/:id/occupations` | Categorias e profissões | Todos |
| `/tabs/states`, `/tabs/states/:code/cities` | Estados e cidades | Todos |
| `/tabs/workers` | Buscar profissionais | Todos (contato só logado) |
| `/tabs/workers/:id` | Perfil público do profissional | Todos (contato só logado) |
| `/login`, `/register-client`, `/register-worker` | Entrar e criar conta | Todos |
| `/forgot-password`, `/reset-password`, `/verify-email` | Senha e confirmação de e-mail | Todos (links dos e-mails) |
| `/ajuda` | Ajuda e suporte | Todos |
| `/privacidade` | Política de Privacidade | Todos |
| `/become-worker` | Cliente vira trabalhador | Logado |
| `/delete-account` | Excluir minha conta | Logado |
| `/worker/dashboard`, `/worker/profile/edit`, `/worker/portfolio`, `/worker/ratings` | Painel, perfil, portfólio e avaliações | Trabalhador |

As rotas ficam em `src/presentation/router`.

## 📂 Estrutura

| Pasta | O que tem |
| --- | --- |
| `src/domain` | Tipos do negócio (conta, trabalhador, categorias) |
| `src/application/stores` | Estado com Pinia: login e modo cliente/trabalhador, categorias, tutorial, trabalhador |
| `src/infra` | `http.ts` (axios com o token) e `services/` com as chamadas à API |
| `src/presentation` | Telas (`views`), componentes e rotas |
| `src/i18n` | Textos em `pt-BR.json` e `en.json` |
| `src/shared` | Validação dos formulários e utilidades |
| `public/` | Logo, ícones e `manifest.webmanifest` |

---

## 🚀 Rodar no seu PC

Com a [tpf-api](https://github.com/Ygor-Santts/tpf-api) rodando em `http://localhost:3000`:

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

| Variável | Para quê | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | Endereço da API (chamadas e fotos do portfólio) | `http://localhost:3000` |

Para entrar, use as contas de teste da API (`npm run seed` na tpf-api; todas com a senha `Teste@123`). A tabela das contas está no README da tpf-api.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Abre a versão compilada |

---

## 🌐 Produção

O app não tem servidor próprio: o `docker-compose.server.yml` da tpf-api compila este repositório com o `Dockerfile.web` (que usa `VITE_API_URL=https://api.SEU_DOMINIO`) e o Caddy serve os arquivos em `https://SEU_DOMINIO`. No servidor, este repositório fica em `~/tpf-app`, ao lado de `~/tpf-api`. O passo a passo do servidor está no README da tpf-api, em "Servidor (produção)".

O `Dockerfile` (sem `.web`) é só para rodar o servidor de desenvolvimento num container.

### Publicação automática

Todo merge na `main` é compilado no GitHub (aba **Actions**, workflow **Deploy**) e, se compilar, o servidor baixa a nova versão e recompila o app e a API. Precisa de três segredos neste repositório (**Settings → Secrets and variables → Actions**), os mesmos da tpf-api:

| Nome | Valor |
| --- | --- |
| `SERVER_HOST` | IP do servidor |
| `SERVER_USER` | `root` |
| `SERVER_SSH_KEY` | a chave do deploy (no servidor: `cat ~/.ssh/github-deploy`) |

Sem os segredos, a compilação roda e a publicação é pulada. Para publicar sem um merge novo: **Actions → Deploy → Run workflow**.

---

## 📱 Lojas (próximo passo)

O app ainda não está na Google Play nem na App Store. O plano é gerar os apps com Capacitor a partir deste projeto, criar as contas de desenvolvedor (Google US$ 25 uma vez, Apple US$ 99 por ano) e passar pelo teste fechado de 14 dias que o Google pede para contas novas.

## 🧪 Qualidade

Há configuração de ESLint e Prettier (`.eslintrc.cjs`, `.prettierrc`), mas o ESLint ainda não está nas dependências e não há testes automáticos neste repositório. O GitHub Actions compila cada mudança antes de publicar.
