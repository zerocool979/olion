require('dotenv').config()
const app = require('./app')
const { PORT } = require('./config/env')

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`)
})
