import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import type { IAuthStore } from '../types'

export const useAuthStore = create<IAuthStore>((set) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')
			set({ authUser: res.data })
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error useAuthStore store:', error.message)
			}

			console.log('Unknown useAuthStore error:', error)
			set({ authUser: null })
		} finally {
			set({ isCheckingAuth: false })
		}
	},

	signUp: async (data) => {
		set({ isSigningUp: true })
		try {
			const res = await axiosInstance.post('/auth/signup', data)
			set({ authUser: res.data })
			toast.success('Account created successfully!')
		} catch (error: unknown) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			}
		} finally {
			set({ isSigningUp: false })
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout')
			set({ authUser: null })
			toast.success('Logged out successfully!')
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			}
		}
	},
	login: async (data) => {
		set({ isLoggingIn: true })
		try {
			const res = await axiosInstance.post('/auth/login', data)
			set({ authUser: res.data })
			toast.success('Logged in successfully!')
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			}
		} finally {
			set({ isLoggingIn: false })
		}
	},
}))
