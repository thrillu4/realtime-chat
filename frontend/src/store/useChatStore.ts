import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import type { IChatStore } from '../types'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create<IChatStore>((set, get) => ({
	users: [],
	messages: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	setSelectedUser: (selectedUser) => set({ selectedUser }),

	getUsers: async () => {
		set({ isUsersLoading: true })
		try {
			const res = await axiosInstance.get('messages/users')
			set({ users: res.data })
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
			set({ isUsersLoading: false })
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true })
		try {
			const res = await axiosInstance.get(`/messages/${userId}`)
			set({ messages: res.data })
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
			set({ isMessagesLoading: false })
		}
	},

	sendMessage: async (messageData) => {
		const { messages, selectedUser } = get()
		try {
			const res = await axiosInstance.post(
				`/messages/send/${selectedUser?._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error(error.response?.data?.message ?? error.message)
			}
			toast.error('Something went wrong!', {
				position: 'bottom-right',
			})
		}
	},

	subscribeToMessage: () => {
		const { selectedUser } = get()
		if (!selectedUser) return

		const socket = useAuthStore.getState().socket

		socket?.on('newMessage', (newMessage) => {
			if (newMessage.senderId !== selectedUser._id) return

			set({ messages: [...get().messages, newMessage] })
		})
	},

	unsubscribeFromMessage: () => {
		const socket = useAuthStore.getState().socket
		socket?.off('newMessage')
	},
}))
