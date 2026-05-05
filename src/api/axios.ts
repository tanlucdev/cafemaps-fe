import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api-proxy",
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
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
    return Promise.reject(new Error(message))
  }
)

export default apiClient
