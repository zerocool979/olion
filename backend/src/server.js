require('dotenv').config()
const http = require('http')
const app = require('./app')
const { initSocket } = require('./socket')
const { PORT } = require('./config/env')

// FIX: app.listen() lama tidak bisa dipakai bareng Socket.IO — Socket.IO
// butuh instance http.Server eksplisit supaya bisa "menumpang" di port yang
// sama dengan REST API (bukan port terpisah, yang akan merepotkan
// deploy/CORS/proxy di hosting seperti Railway/Render).
const httpServer = http.createServer(app)
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`✓ Backend (REST + Socket.IO) running on http://localhost:${PORT}`)
})
