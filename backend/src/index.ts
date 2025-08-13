import config from './config/config'
import { connectDB } from './lib/db'
import app from './server'

app.listen(config.port, () => {
	console.log(`Server is running on PORT - ${config.port}`)
	connectDB()
})
