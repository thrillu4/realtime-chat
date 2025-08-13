import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
	if (!process.env.JWT_SECRET) return console.log('No json web token find')
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	})

	res.cookie('jwt', token, {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: 'strict',
	})

	return token
}
