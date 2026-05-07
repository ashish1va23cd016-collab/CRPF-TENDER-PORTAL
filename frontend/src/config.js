export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }

  if (import.meta.env.DEV) {
    return 'https://crpf-tender-portal.onrender.com'
  }

  return window.location.origin
}