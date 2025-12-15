import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'

export async function createApp() {
    const app = express()
    let vite

    if (!isProd) {
        // Create Vite server in middleware mode and configure the app type as 'custom'
        // This is necessary for serving the app in development mode
        const { createServer: createViteServer } = await import('vite')
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        })

        // Use vite's connect instance as middleware
        app.use(vite.middlewares)
    } else {
        // Production: Serve static assets
        const clientDist = path.resolve(__dirname, 'dist/client')
        app.use(express.static(clientDist, { index: false }))
    }

    // Serve HTML
    app.use(async (req, res, next) => {
        const url = req.originalUrl

        try {
            let template, render

            if (!isProd) {
                // 1. Read index.html
                template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')

                // 2. Apply Vite HTML transforms
                template = await vite.transformIndexHtml(url, template)

                // 3. Load the server entry
                render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
            } else {
                // 1. Read template from dist
                template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')

                // 2. Load the server entry
                render = (await import('./dist/server/entry-server.js')).render
            }

            // 4. Render the app HTML
            const appHtml = render(url)

            // 5. Inject the app-rendered HTML into the template.
            const html = template.replace('<!--app-html-->', appHtml)

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // If an error is caught, let Vite fix the stacktrace so it maps back to
            // your actual source code.
            vite?.ssrFixStacktrace(e)
            console.error(e)
            res.status(500).end(e.message)
        }
    })

    return app
}

