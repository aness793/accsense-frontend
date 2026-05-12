import { useEffect, useState } from 'react'

export function useLiveFeed() {
  const [latest, setLatest] = useState(null)
  const [connected, setConnected] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    // const ws = new WebSocket('ws://localhost:8000/ws')
    const wsUrl = import.meta.env.VITE_WS_URL
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setConnected(true)
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data)
      setLatest(payload)
      setHistory(prev => [payload, ...prev].slice(0, 50))
    }

    ws.onclose = () => {
      setConnected(false)
      console.log('WebSocket disconnected')
    }

    ws.onerror = (err) => {
      setConnected(false)
      console.error('WebSocket error:', err)
    }

    return () => ws.close()
  }, [])

  return { latest, connected, history }
}