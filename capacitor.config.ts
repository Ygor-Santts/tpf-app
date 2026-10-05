import type { CapacitorConfig } from '@capacitor/cli'

// Em desenvolvimento a API roda em http na rede local; o app empacotado é servido em https://localhost.
// Defina CAP_ALLOW_HTTP=false no build de produção (API em https) para bloquear conteúdo misto.
const allowHttp = process.env.CAP_ALLOW_HTTP !== 'false'

const config: CapacitorConfig = {
  appId: 'com.trampofacil.app',
  appName: 'Trampo Fácil',
  webDir: 'dist',
  android: {
    allowMixedContent: allowHttp,
  },
}

export default config
