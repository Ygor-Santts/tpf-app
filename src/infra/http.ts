import axios from 'axios'
// The one address of the API, for calls and for portfolio files.
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const mediaUrl = (url: string) => (url.startsWith('http') ? url : `${API_URL}${url}`)

const api = axios.create({ baseURL: API_URL })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tpf_token')
  if (token) { config.headers = config.headers || {}; config.headers.Authorization = `Bearer ${token}` }
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem('tpf_token'))
      localStorage.removeItem('tpf_token')
      localStorage.removeItem('tpf_user')
      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        window.location.href = hadToken ? '/login?expired=1' : '/login'
      }
    }
    return Promise.reject(error)
  }
)
export { api }
