import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

export function render(url) {
    const queryClient = new QueryClient()
    const html = renderToString(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </QueryClientProvider>
        </StrictMode>,
    )
    return { html }
}
