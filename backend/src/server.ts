import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.ts'
import messageRoutes from './routes/message.route.ts'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/message', messageRoutes)

export default app
