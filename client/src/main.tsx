import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/notifications/styles.css'
import { ApolloProvider } from '@apollo/client/react'
import { ThemeProfileProvider } from './components/ThemeProfileContext.tsx'
import { ThemedApp } from './ThemedApp.tsx'
import { apolloClient } from './apollo/client.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProfileProvider>
        <ThemedApp />
      </ThemeProfileProvider>
    </ApolloProvider>
  </StrictMode>,
)
