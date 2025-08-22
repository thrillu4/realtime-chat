import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import cloudinary from '../lib/cloudinary.js'
import { generateToken } from '../lib/utils.js'
import { AuthRequest } from '../middleware/auth.middleware.js'
import User from '../models/user.model.js'

export const signup = async (req: Request, res: Response) => {
	const { email, fullName, password } = req.body

	try {
		if (!email || !fullName || !password)
			return res.status(400).json({ message: 'All inputs must be filled' })
		if (password.length < 6) {
			res
				.status(400)
				.json({ message: 'Password must be at least 6 characters' })
		}

		const user = await User.findOne({ email })

		if (user)
			return res
				.status(400)
				.json({ message: 'User with this email already exist!' })

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			email,
			fullName,
			password: hashedPassword,
		})

		if (newUser) {
			generateToken(newUser._id, res)
			await newUser.save()

			res.status(201).json({
				_id: newUser._id,
				email: newUser.email,
				fullName: newUser.fullName,
				password: newUser.password,
			})
		} else {
			res.status(400).json({ message: 'Invalid user data' })
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error signup controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown signup error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		if (!email || !password)
			return res.status(400).json({ message: 'Fill in all inputs' })

		if (password.length < 6)
			return res
				.status(400)
				.json({ message: 'Password must be at least 6 characters ' })

		const user = await User.findOne({ email })

		if (user) {
			const isCorrectPassword = await bcrypt.compare(password, user.password)
			if (!isCorrectPassword)
				return res.status(400).json({ message: 'Invalid credentials' })

			generateToken(user._id, res)
			res.status(200).json({
				_id: user._id,
				email: user.email,
				fullName: user.fullName,
				profilePic: user.profilePic,
			})
		} else {
			res.status(400).json({ message: 'Invalid credentials' })
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error login controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown login error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}
export const logout = (req: Request, res: Response) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 })
		res.status(200).json({ message: 'Logged out successfully' })
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error logout controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown logout error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}

export const updateUser = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.file) {
			res.status(400).json({ message: 'No image file provided.' })
		} else if (req.user) {
			const fileUri = `data:${
				req.file.mimetype
			};base64,${req.file.buffer.toString('base64')}`
			const userId = req.user._id
			const result = await cloudinary.uploader.upload(fileUri, {
				folder: 'user-avatars',
				public_id: req.file.filename + userId,
				overwrite: true,
			})
			const updateUser = await User.findByIdAndUpdate(
				userId,
				{
					profilePic: result.secure_url,
				},
				{ new: true }
			)
			res.status(200).json(updateUser)
		}

		// const { profilePic } = req.body
		// if (!profilePic)
		// 	res.status(400).json({ message: 'Profile picture is required' })
		// if (req.user) {
		// 	const userId = req.user._id

		// 	const uploadResponse = await cloudinary.uploader.upload(profilePic)
		// 	const updateUser = await User.findByIdAndUpdate(
		// 		userId,
		// 		{
		// 			profilePic: uploadResponse.secure_url,
		// 		},
		// 		{ new: true }
		// 	)
		// 	res.status(200).json(updateUser)
		// }
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error updateUser controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown updateUser error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}

export const checkAuth = (req: AuthRequest, res: Response) => {
	try {
		res.status(200).json(req.user)
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error checkAuth controller:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown checkAuth error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}
