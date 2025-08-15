import express from 'express'
import {
	getMessages,
	getUsersForSidebar,
	sendMessage,
} from '../controllers/message.controller'
import { protectRoute } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)
router.get('/send/:id', protectRoute, sendMessage)

export default router
