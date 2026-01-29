import { useEffect, useRef, useCallback } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";

const SOHA_USERNAME = "soha";
const HASNAIN_USERNAME = "hasnain";

const Messages = ({ isSoha, isHasnain }) => {
	const { messages, loading, setMessages } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	// Function to remove a message instantly from UI
	const removeMessage = useCallback((messageId) => {
		setMessages((prevMessages) => 
			prevMessages.filter((msg) => msg._id !== messageId)
		);
	}, [setMessages]);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
			{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message 
							message={message} 
							isSoha={isSoha} 
							isHasnain={isHasnain}
							onDelete={() => removeMessage(message._id)}
						/>
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			
			{!loading && messages.length === 0 && (
				<div className="flex flex-col items-center justify-center h-full text-center py-8">
					<div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
						isSoha ? "bg-pink-100" : isHasnain ? "bg-blue-100" : "bg-gray-100"
					}`}>
						<svg className={`w-8 h-8 ${
							isSoha ? "text-pink-400" : isHasnain ? "text-blue-400" : "text-gray-400"
						}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<p className="text-gray-500 text-sm">No messages yet</p>
					<p className={`text-gray-400 text-xs mt-1 ${
						isSoha ? "sparkle" : isHasnain ? "" : ""
					}`}>
						{isSoha 
							? "Send a message to start your conversation 💕" 
							: isHasnain
								? "Send a message to start the conversation"
								: "Send a message to start the conversation"}
					</p>
				</div>
			)}
		</div>
	);
};
export default Messages;
