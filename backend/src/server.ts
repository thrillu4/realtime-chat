import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import authRouter from './routes/auth.route.ts'
import messageRoutes from './routes/message.route.ts'

const app = express()

app.use(
	express.json({
		limit: '10mb',
	})
)
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)
app.use('/api/auth', authRouter)
app.use('/api/messages', messageRoutes)

export default app
