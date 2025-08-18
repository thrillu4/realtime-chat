import { z } from 'zod'

export interface User {
	_id: string
	email: string
	fullName: string
	password: string
	profilePic: string
	createdAt: string
	updatedAt: string
}

export interface IAuthStore {
	authUser: null | User
	isSigningUp: boolean
	isLoggingIn: boolean
	isUpdatingProfile: boolean
	isCheckingAuth: boolean
	checkAuth: () => void
	signUp: (data: SignUpType) => Promise<void>
	logout: () => void
	login: (data: LoginType) => Promise<void>
	updateProfile: (file: FormData) => void
}

export const SignUpSchema = z.object({
	fullName: z.string().min(3, 'Enter at least 3 characters!'),
	email: z.email('Incorrect email address!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
})

export const LoginSchema = z.object({
	email: z.email('Incorrect email address!'),
	password: z.string().min(6, 'Password must be at least 6 characters long!'),
})

export type SignUpType = z.infer<typeof SignUpSchema>
export type LoginType = z.infer<typeof LoginSchema>
