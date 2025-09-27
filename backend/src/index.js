import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './config/prisma.js'
import authRoutes from './routes/auth.routes.js'
import muridRoutes from './routes/murid.routes.js'
import nilaiRoutes from './routes/nilai.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Salsabila Backend OK' })
})

app.use('/auth', authRoutes)
app.use('/murid', muridRoutes)
app.use('/nilai', nilaiRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

