import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User, { IUser } from '../models/user.model.js'

export interface AuthRequest extends Request {
	user?: IUser
}

export const protectRoute = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies.jwt

		if (!token)
			return res
				.status(401)
				.json({ message: 'Unauthorized - No token provided!' })
		if (process.env.JWT_SECRET) {
			const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
			if (!decode) {
				return res
					.status(401)
					.json({ message: 'Unauthorized - Invalid token!' })
			}

			const user = await User.findById(decode.userId).select('-password')
			if (!user) return res.status(401).json({ message: 'User not found!' })

			req.user = user as unknown as IUser

			next()
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error protect route middleware:', error.message)
			return res.status(500).json({ message: error.message })
		}

		console.log('Unknown protect route middleware error:', error)
		return res.status(500).json({ message: 'Something went wrong' })
	}
}
