import http from 'http'
import { Server } from 'socket.io'
import app from '../server'

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: ['http://localhost:5173'],
		credentials: true,
	},
})

const userSocketMap: { [key: string]: string } = {}

export const getReceiverSocketId = (receiverId: string) =>
	userSocketMap[receiverId]

io.on('connection', (socket) => {
	console.log('A user connected', socket.id)

	const userId = socket.handshake.query.userId as string
	if (userId) userSocketMap[userId] = socket.id

	io.emit('getOnlineUsers', Object.keys(userSocketMap))

	socket.on('disconnect', () => {
		console.log('A user disconnected', socket.id)
		delete userSocketMap[userId]
		io.emit('getOnlineUsers', Object.keys(userSocketMap))
	})
})

export { app, io, server }
