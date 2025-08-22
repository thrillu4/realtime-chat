import express from 'express'
import {
	checkAuth,
	login,
	logout,
	signup,
	updateUser,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-user', protectRoute, upload.single('file'), updateUser)
router.get('/check', protectRoute, checkAuth)

export default router
