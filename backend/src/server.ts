import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import path from 'path'
import authRouter from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app = express()
const __dirname = path.resolve()

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

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')))

	app.get('/{*splat}', (_req, res) => {
		res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
	})
}

export default app
