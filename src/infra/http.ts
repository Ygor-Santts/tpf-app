import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' })
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
