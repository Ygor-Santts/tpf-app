import { createI18n } from 'vue-i18n'
import ptBR from './pt-BR.json'
import en from './en.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: { 'pt-BR': ptBR, en }
})
