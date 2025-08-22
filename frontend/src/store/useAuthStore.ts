import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import type { IAuthStore } from '../types'

const BASE_URL =
	import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/api'

export const useAuthStore = create<IAuthStore>((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,
	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check')
			set({ authUser: res.data })
			get().connectSocket()
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
			toast.success('Account created successfully!', {
				position: 'bottom-right',
			})
			get().connectSocket()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!', {
				position: 'bottom-right',
			})
		} finally {
			set({ isSigningUp: false })
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout')
			set({ authUser: null })
			toast.success('Logged out successfully!', {
				position: 'bottom-right',
			})
			get().disconnectSocket()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!', {
				position: 'bottom-right',
			})
		}
	},
	login: async (data) => {
		set({ isLoggingIn: true })
		try {
			const res = await axiosInstance.post('/auth/login', data)
			set({ authUser: res.data })
			toast.success('Logged in successfully!', {
				position: 'bottom-right',
			})
			get().connectSocket()
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
				toast.error(error.response?.data?.message ?? error.message, {
					position: 'bottom-right',
				})
			} else if (error instanceof Error) {
				console.error(error.message)
			}
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
			toast.success('Profile image updated successfully!', {
				position: 'bottom-right',
			})
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			} else if (error instanceof Error) {
				console.error(error.message)
			}
			toast.error('Something went wrong!', {
				position: 'bottom-right',
			})
		} finally {
			set({ isUpdatingProfile: false })
		}
	},
	connectSocket: () => {
		const { authUser } = get()
		if (!authUser || get().socket?.connected) return

		const socket = io(BASE_URL, {
			withCredentials: true,
			query: {
				userId: authUser?._id,
			},
		})
		socket.connect()
		set({ socket: socket })
		socket.on('getOnlineUsers', (usersIds) => {
			set({ onlineUsers: usersIds })
		})
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket?.disconnect()
	},
}))
