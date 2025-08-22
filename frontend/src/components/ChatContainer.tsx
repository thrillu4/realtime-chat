import { useEffect, useRef } from 'react'
import { formatMessageTime } from '../lib/utils'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton'

const ChatContainer = () => {
	const {
		getMessages,
		selectedUser,
		isMessagesLoading,
		messages,
		subscribeToMessage,
		unsubscribeFromMessage,
	} = useChatStore()
	const { authUser } = useAuthStore()
	const messageRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (selectedUser?._id) getMessages(selectedUser?._id)
		subscribeToMessage()

		return () => unsubscribeFromMessage()
	}, [
		selectedUser?._id,
		getMessages,
		subscribeToMessage,
		unsubscribeFromMessage,
	])

	useEffect(() => {
		if (messageRef.current && messages)
			messageRef.current.scrollTop = messageRef.current.scrollHeight
	}, [messages])

	if (isMessagesLoading) {
		return (
			<div className='flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)
	}

	return (
		<div className='flex-1 flex flex-col'>
			<ChatHeader />

			<div ref={messageRef} className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.map((message, i) => (
					<div
						key={i}
						className={`chat ${
							message.senderId === authUser?._id ? 'chat-end' : 'chat-start'
						}`}
					>
						<div className=' chat-image avatar'>
							<div className='size-10 rounded-full border'>
								<img
									src={
										message.senderId === authUser?._id
											? authUser?.profilePic || '/avatar.jpg'
											: selectedUser?.profilePic || '/avatar.jpg'
									}
									alt='profile pic'
								/>
							</div>
						</div>
						<div className='chat-header mb-1'>
							<time className='text-xs opacity-50 ml-1'>
								{formatMessageTime(message.createdAt)}
							</time>
						</div>
						<div className='chat-bubble flex flex-col break-words whitespace-pre-wrap max-w-[80%]'>
							{message.image && (
								<img
									src={message.image}
									alt='Attachment'
									className='sm:max-w-[200px] rounded-md mb-2'
								/>
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}
			</div>

			<MessageInput />
		</div>
	)
}

export default ChatContainer
