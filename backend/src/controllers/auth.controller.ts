import { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'

export const signup = async (req: Request, res: Response) => {
	const { email, fullName, password } = req.body

	try {
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
		} else {
			res.status(400).json({ message: 'Invalid user data' })
		}
	} catch (error) {}
}

export const login = (req: Request, res: Response) => {
	res.send('login route')
}
export const logout = (req: Request, res: Response) => {
	res.send('logout route')
}
