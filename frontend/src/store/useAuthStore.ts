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
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!')
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
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!')
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
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!')
		} finally {
			set({ isLoggingIn: false })
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })
		try {
			const res = await axiosInstance.put('/auth/update-user', data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			set({ authUser: res.data })
			toast.success('Profile image updated successfully!')
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!')
		} finally {
			set({ isUpdatingProfile: false })
		}
	},
}))
