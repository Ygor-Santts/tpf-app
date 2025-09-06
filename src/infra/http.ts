import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
})

// Simple token layer using localStorage; you can swap for secure storage
function getToken(): string | null {
  return localStorage.getItem('tpf_token')
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // You can centralize 401 handling here
    if (error?.response?.status === 401) {
      // Optionally redirect to login
    }
    return Promise.reject(error)
  }
)

export { api }
