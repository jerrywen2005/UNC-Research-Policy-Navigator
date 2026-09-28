// All requests use relative /api paths. The Vite proxy (dev) or nginx (prod)
// forwards them to FastAPI, so the frontend never needs the backend's URL.
const API_BASE = '/api'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}
