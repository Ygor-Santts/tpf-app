import { describe, it, expect, beforeEach } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'
import { api } from './http'

type Handler<T> = { fulfilled: (v: T) => T }
const requestInterceptor = () =>
  (api.interceptors.request as unknown as { handlers: Handler<InternalAxiosRequestConfig>[] })
    .handlers[0].fulfilled

describe('http client', () => {
  beforeEach(() => localStorage.clear())

  it('adds the bearer token when one is stored', () => {
    localStorage.setItem('tpf_token', 'abc')
    const config = requestInterceptor()({ headers: {} } as InternalAxiosRequestConfig)
    expect(config.headers.Authorization).toBe('Bearer abc')
  })

  it('leaves the request untouched without a token', () => {
    const config = requestInterceptor()({ headers: {} } as InternalAxiosRequestConfig)
    expect(config.headers.Authorization).toBeUndefined()
  })
})
