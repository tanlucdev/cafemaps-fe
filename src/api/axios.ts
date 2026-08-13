import axios from "axios"
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys"

const apiClient = axios.create({
  baseURL: "/api-proxy",
  withCredentials: true,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(new Error("Request was cancelled"))
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out. Please try again."))
    }
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message
    return Promise.reject(Object.assign(new Error(message), { status: error.response?.status }))
  }
)

export default apiClient
