# Mobile (Android) — Capacitor

O TPF é um único código Vue para **web/desktop** e **app Android**. O app nativo é gerado pelo [Capacitor 8](https://capacitorjs.com/), que empacota o build do Vite (`dist/`) dentro de um WebView. **O app é o alvo principal**: toda tela nova precisa funcionar bem no celular.

## Pré-requisitos

| Ferramenta | Versão | Observação |
|---|---|---|
| Node | 22+ | Já usado no projeto |
| JDK | 21 | Exigido pelo Capacitor 8 / Gradle |
| Android SDK | API 36 (compile/target), mínimo API 24 | Via Android Studio ou `cmdline-tools` |

Onde compilar (escolha um):

- **No WSL (recomendado, o repo já está aqui):** instale `openjdk-21-jdk` e as Android `cmdline-tools`, depois defina `ANDROID_HOME` e rode os scripts abaixo.
- **No Windows com Android Studio:** abra a pasta `android/` de um clone do repositório **no disco do Windows**. O Gradle em caminho `\\wsl.localhost\...` costuma ser lento e instável.

## Configuração da API

A URL da API fica **embutida no build**. Copie `.env.example` para `.env` e ajuste:

```env
VITE_API_BASE_URL=http://192.168.0.109:3000   # IP do PC na rede Wi-Fi (celular físico)
# VITE_API_BASE_URL=http://10.0.2.2:3000      # emulador Android
```

`localhost` no celular aponta para o **próprio celular**. Por isso use o IP do PC, com o celular na mesma rede e a porta 3000 acessível pela rede local (no WSL2 isso exige `networkingMode=mirrored` e uma regra de firewall).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run android:sync` | `vite build` e copia o `dist/` para o projeto Android |
| `npm run android:apk` | Sync e gera o **APK de debug** com Gradle |
| `npm run android:run` | Sync e instala/abre num aparelho conectado (USB) ou emulador |
| `npm run android:open` | Abre o projeto no Android Studio |

O APK sai em `android/app/build/outputs/apk/debug/app-debug.apk`.

**Sempre rode o `android:sync` depois de mudar o código web.** O projeto Android só enxerga o último build.

## Instalar no celular

- **Por USB:** ative *Opções do desenvolvedor → Depuração USB* e rode `npm run android:run` (ou `adb install app-debug.apk`).
- **Sem cabo:** envie o `app-debug.apk` para o celular (Drive, e-mail, mensagem) e abra o arquivo. O Android vai pedir para permitir *instalar apps desconhecidos* para o app usado.

## HTTP vs HTTPS

| Build | `http` liberado? | Onde está configurado |
|---|---|---|
| **debug** | Sim (para falar com a API local) | `android/app/build.gradle` → `manifestPlaceholders` |
| **release** | Não, exige API em `https` | Idem |

O WebView serve o app em `https://localhost`. Para chamar uma API `http` no debug, o `capacitor.config.ts` libera conteúdo misto, **exceto** quando o sync é feito com `CAP_ALLOW_HTTP=false`, como deve ser no release.

## Diretrizes para telas no app

- **Áreas seguras:** o header usa `pt-safe` e o conteúdo usa `pt-header-safe` / `pb-nav-safe` (definidos em `tailwind.config.js`), para nada ficar embaixo da status bar ou da barra de navegação. Componentes fixos novos (`fixed top-0` / `bottom-0`) devem usar as mesmas utilidades.
- **Toque:** alvos de pelo menos 44px, sem depender de `hover`.
- **Navegação:** o botão *voltar* do Android usa o histórico do WebView (vue-router). Fluxos que não devem voltar (login, fim de cadastro) usam `router.replace`.
- **Rede:** os ícones do Iconify são baixados em tempo de execução. Sem internet, a tela fica sem ícones.

## Checklist para publicar (release)

- [ ] API em `https` e `VITE_API_BASE_URL` apontando para ela
- [ ] `CAP_ALLOW_HTTP=false npm run android:sync`
- [ ] Ícone e splash do app (`@capacitor/assets` com uma logo em alta resolução)
- [ ] Keystore de assinatura (fora do git: `*.jks` / `*.keystore` estão ignorados)
- [ ] `versionCode` / `versionName` em `android/app/build.gradle`
- [ ] Gerar o `.aab` para a Play Store (`./gradlew bundleRelease`)
