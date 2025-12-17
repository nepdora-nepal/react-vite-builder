/* eslint-env node */
import app from './server.js'

import { loadEnv } from 'vite'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')
const port = env.PORT || process.env.PORT || 5173

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
