import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'
const root = process.cwd()

if (!isProd) {
    // DEV MODE: Use Vite middleware
    const vite = await (await import('vite')).createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    })

    app.use(vite.middlewares)

    // Middleware for all requests
    app.use(async (req, res, next) => {
        const url = req.originalUrl

        try {
            // 1. Read index.html
            let template = fs.readFileSync(
                path.resolve(root, 'index.html'),
                'utf-8',
            )

            // 2. Apply Vite HTML transforms
            template = await vite.transformIndexHtml(url, template)

            // 3. Load the server entry
            const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

            // 4. Render the app HTML
            const { html: appHtml } = await render(url)

            // 5. Inject the app-rendered HTML into the template
            const html = template.replace('<!--app-html-->', appHtml)

            // 6. Send the rendered HTML back
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace
            vite.ssrFixStacktrace(e)
            next(e)
        }
    })
} else {
    // PROD MODE: Serve built assets
    const clientDist = path.resolve(__dirname, 'dist/client')
    const serverDist = path.resolve(__dirname, 'dist/server')

    app.use(express.static(clientDist))

    // Render everything else with SSR
    app.use(async (req, res) => {
        try {
            const template = fs.readFileSync(
                path.join(clientDist, 'index.html'),
                'utf-8',
            )

            const { render } = await import(
                path.join(serverDist, '/src/entry-server.tsx')
            )

            const { html: appHtml } = render(req.originalUrl)

            const html = template.replace('<!--app-html-->', appHtml)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            console.error(e)
            res.status(500).end('Internal Server Error')
        }
    })
}
