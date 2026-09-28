import { useEffect, useState } from 'react'
import { apiGet } from './api/client'

type ApiStatus = 'checking' | 'ok' | 'unreachable'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    apiGet<{ status: string }>('/health')
      .then((body) => setApiStatus(body.status === 'ok' ? 'ok' : 'unreachable'))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  return (
    <main>
      <h1>UNC Research Policy Navigator</h1>
      <p>API status: {apiStatus}</p>
    </main>
  )
}

export default App
