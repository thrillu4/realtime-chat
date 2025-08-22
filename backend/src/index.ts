import config from './config/config.js'
import { connectDB } from './lib/db.js'
import { server } from './lib/socket.js'

server.listen(config.port, () => {
	console.log(`Server is running on PORT - ${config.port}`)
	connectDB()
})
