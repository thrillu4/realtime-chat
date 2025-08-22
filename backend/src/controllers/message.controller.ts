import { Response } from 'express'
import cloudinary from '../lib/cloudinary'
import { getReceiverSocketId, io } from '../lib/socket'
import { AuthRequest } from '../middleware/auth.middleware'
import Message from '../models/message.model'
import User from '../models/user.model'

export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
	try {
		if (req.user) {
			const loggedInUserId = req.user._id
			const filteredUsers = await User.find({
				_id: { $ne: loggedInUserId },
			}).select('-password')

			res.status(200).json(filteredUsers)
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error getUsersForSidebar controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown getUsersForSidebar error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}

export const getMessages = async (req: AuthRequest, res: Response) => {
	try {
		const { id: userToChatId } = req.params
		if (req.user) {
			const myId = req.user._id

			const messages = await Message.find({
				$or: [
					{
						senderId: myId,
						receiverId: userToChatId,
					},
					{ senderId: userToChatId, receiverId: myId },
				],
			})
			res.status(200).json(messages)
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error getMessages controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown getMessages error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}

export const sendMessage = async (req: AuthRequest, res: Response) => {
	try {
		const { id: receiverId } = req.params
		const { text, image } = req.body
		if (req.user) {
			const senderId = req.user._id

			let imageUrl
			if (image) {
				const uploadResponse = await cloudinary.uploader.upload(image)
				imageUrl = uploadResponse.secure_url
			}

			const newMessage = new Message({
				receiverId,
				senderId,
				text,
				image: imageUrl,
			})
			await newMessage.save()

			const receiverSocketId = getReceiverSocketId(receiverId)
			if (receiverSocketId) {
				io.to(receiverSocketId).emit('newMessage', newMessage)
			}

			res.status(201).json(newMessage)
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error sendMessage controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown sendMessage error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}
