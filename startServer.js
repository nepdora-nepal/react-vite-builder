import { createApp } from './server.js'

const port = process.env.PORT || 5173

createApp().then((app) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
})
