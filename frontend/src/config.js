export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }

  return window.location.origin
}