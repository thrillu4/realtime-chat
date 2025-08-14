import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export const generateToken = (userId: Types.ObjectId, res: Response) => {
	if (!process.env.JWT_SECRET) return console.log('No json web token find')
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	})

	res.cookie('jwt', token, {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV !== 'development',
	})

	return token
}
