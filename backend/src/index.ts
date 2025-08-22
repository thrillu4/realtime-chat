import config from './config/config'
import { connectDB } from './lib/db'
import { server } from './lib/socket'

server.listen(config.port, () => {
	console.log(`Server is running on PORT - ${config.port}`)
	connectDB()
})
