import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/notifications/styles.css'
import { ThemeProfileProvider } from './components/ThemeProfileContext.tsx'
import { ThemedApp } from './ThemedApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProfileProvider>
      <ThemedApp />
    </ThemeProfileProvider>
  </StrictMode>,
)
