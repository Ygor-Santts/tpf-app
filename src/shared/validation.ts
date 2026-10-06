import { reactive, nextTick, watch } from 'vue'

// A rule returns an error message, or '' when the value is fine.
export type Rule = (value: any) => string

// Brazilian phone, national digits only: DDD + 8 digits (landline) or
// DDD + 9 + 8 digits (mobile). Same rule as the API.
const BR_PHONE = /^[1-9][0-9](9\d{8}|[2-5]\d{7})$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_MIN = 8

const isEmpty = (v: unknown) => v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)

export const required = (message = 'Campo obrigatório.'): Rule => (v) => (isEmpty(v) ? message : '')
export const email: Rule = (v) => (isEmpty(v) || EMAIL.test(v.trim()) ? '' : 'Informe um e-mail válido.')
export const phone: Rule = (v) =>
  isEmpty(v) || BR_PHONE.test(phoneDigits(v)) ? '' : 'Telefone inválido. Ex.: (34) 99999-9999.'
export const minLength = (n: number): Rule => (v) => (isEmpty(v) || v.length >= n ? '' : `Use pelo menos ${n} caracteres.`)
export const sameAs = (other: () => string, message: string): Rule => (v) => (isEmpty(v) || v === other() ? '' : message)

// Only digits, without a leading country code.
export function phoneDigits(value: string) {
  const digits = (value || '').replace(/\D/g, '')
  return digits.length > 11 && digits.startsWith('55') ? digits.slice(2) : digits
}

// WhatsApp click-to-chat link with a ready message, or '' for a landline.
export function whatsappUrl(phone: string, name: string) {
  const d = phoneDigits(phone)
  if (!/^[1-9][0-9]9\d{8}$/.test(d)) return ''
  const text = `Olá, ${name.trim().split(' ')[0]}! Vi seu perfil no Trampo Fácil e gostaria de um orçamento.`
  return `https://wa.me/55${d}?text=${encodeURIComponent(text)}`
}

// "34999999999" -> "(34) 99999-9999", also while the person is typing.
export function formatPhone(value: string) {
  const d = phoneDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  const rest = d.slice(2)
  const split = rest.length > 8 ? 5 : 4
  return `(${d.slice(0, 2)}) ${rest.slice(0, split)}${rest.length > split ? '-' + rest.slice(split) : ''}`
}

type Schema<T> = Partial<Record<keyof T & string, Rule[]>>

// Reads an API error: the general message plus the per-field messages the
// API sends for invalid input.
export function apiError(e: any, fallback: string) {
  const data = e?.response?.data
  const message = Array.isArray(data?.message) ? data.message[0] : data?.message
  return { message: (message as string) || fallback, fields: (data?.errors ?? {}) as Record<string, string> }
}

async function focusFirstError() {
  await nextTick()
  document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}

// Keeps one error message per field. A field is checked when the person
// leaves it (check, on blur) and every field is checked on submit (validate).
// Once a field shows an error it is re-checked as the person types, so the
// message goes away as soon as it is fixed.
// Each input marks itself with :aria-invalid="!!errors.field", which the
// global style paints red and validate() uses to focus the first wrong field.
export function useValidation<T extends object>(values: T, schema: Schema<T>) {
  const errors = reactive<Record<string, string>>({})
  const fields = Object.keys(schema)

  function check(field: string) {
    const rules = schema[field as keyof Schema<T>] ?? []
    const value = (values as any)[field]
    errors[field] = rules.map((rule) => rule(value)).find(Boolean) ?? ''
    return !errors[field]
  }

  for (const field of fields) {
    watch(() => (values as any)[field], () => { if (errors[field]) check(field) }, { deep: true })
  }

  async function validate(only = fields) {
    const ok = only.map(check).every(Boolean)
    if (!ok) await focusFirstError()
    return ok
  }

  function setErrors(apiFields: Record<string, string>) {
    Object.assign(errors, apiFields)
    if (Object.keys(apiFields).length) focusFirstError()
  }

  return { errors, check, validate, setErrors }
}
