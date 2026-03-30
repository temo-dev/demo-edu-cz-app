import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Auto-update service worker, show reload prompt if needed
registerSW({
  onNeedRefresh() {
    if (confirm('Có phiên bản mới! Tải lại để cập nhật?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('App sẵn sàng dùng offline!')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
