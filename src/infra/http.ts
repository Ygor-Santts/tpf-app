import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tpf_token')
  if (token) { config.headers = config.headers || {}; (config.headers as any).Authorization = `Bearer ${token}` }
  return config
})
export { api }
