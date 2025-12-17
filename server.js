import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fetch from 'node-fetch'

// API fetching function
async function fetchProducts() {
    try {
        const response = await fetch('https://glow.nepdora.baliyoventures.com/api/product/')
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`)
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching products:', error)
        return null
    }
}

export const app = express()

// Helper variables for path resolution in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'
const root = process.cwd()

if (!isProd) {
    // DEV MODE: Use Vite middleware (UNMODIFIED)
    const vite = await (await import('vite')).createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    })

    app.use(vite.middlewares)

    // Middleware for all requests
    app.use(async (req, res, next) => {
        const url = req.originalUrl

        try {
            // 1. Read index.html (source)
            let template = fs.readFileSync(
                path.resolve(root, 'index.html'),
                'utf-8',
            )

            // 2. Apply Vite HTML transforms
            template = await vite.transformIndexHtml(url, template)

            // 3. Load the server entry
            const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

            // 4. Fetch data for SSR (only for /products route)
            const initialData = {}
            if (url === '/products' || url === '/products/') {
                const products = await fetchProducts()
                if (products) {
                    initialData.products = products
                }
            }

            // 5. Render the app HTML with initial data
            const { html: appHtml } = await render(url, initialData)

            // 6. Inject the app-rendered HTML and initial data into the template
            const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, '\\u003c')};</script>`
            let html = template.replace('<!--app-html-->', appHtml)
            html = html.replace('<!--app-head-->', dataScript)

            // 7. Send the rendered HTML back
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace
            vite.ssrFixStacktrace(e)
            next(e)
        }
    })
} else {
    // PROD MODE: Serve built assets and perform SSR (CORRECTED)
    const clientDist = path.resolve(__dirname, 'dist/client')
    const serverDist = path.resolve(__dirname, 'dist/server')

    // Serve static assets but NOT index.html (SSR will handle that)
    app.use(express.static(clientDist, { index: false }))

    // Render everything else with SSR
    app.use(async (req, res) => {
        try {
            const template = fs.readFileSync(
                path.join(clientDist, 'index.html'),
                'utf-8',
            )

            // 3. Load the server entry
            const { render } = await import(
                pathToFileURL(path.join(serverDist, 'entry-server.js')).href
            )

            // 4. Fetch data for SSR (only for /products route)
            const initialData = {}
            if (req.originalUrl === '/products' || req.originalUrl === '/products/') {
                const products = await fetchProducts()
                if (products) {
                    initialData.products = products
                }
            }

            // 5. Render the app HTML with initial data
            const { html: appHtml } = render(req.originalUrl, initialData)

            // 6. Inject the app-rendered HTML and initial data into the template
            const dataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData).replace(/</g, '\\u003c')};</script>`
            let html = template.replace('<!--app-html-->', appHtml)
            html = html.replace('<!--app-head-->', dataScript)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            console.error(e)
            res.status(500).end('Internal Server Error')
        }
    })
}
