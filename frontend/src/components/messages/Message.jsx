import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import toast from "react-hot-toast";

const SOHA_USERNAME = "soha";
const HASNAIN_USERNAME = "hasnain";

const Message = ({ message, isSoha, isHasnain, onDelete }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const { deleteMessage } = useDeleteMessage();
	
	const [showDeleteBtn, setShowDeleteBtn] = useState(false);
	const pressTimerRef = useRef(null);
	
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const isFromSoha = !fromMe && selectedConversation?.username?.toLowerCase() === SOHA_USERNAME;
	const isFromHasnain = !fromMe && selectedConversation?.username?.toLowerCase() === HASNAIN_USERNAME;

	// Handle long press
	const handlePressStart = () => {
		if (!fromMe) return;
		
		pressTimerRef.current = setTimeout(() => {
			setShowDeleteBtn(true);
		}, 300); // Shorter delay for faster response
	};

	const handlePressEnd = async () => {
		if (pressTimerRef.current) {
			clearTimeout(pressTimerRef.current);
		}
		
		if (showDeleteBtn && fromMe) {
			// Remove message instantly from UI
			onDelete();
			// Then delete from backend silently
			await deleteMessage(message._id);
			// Show toast (optional, can remove if you want completely silent)
			// toast.success("Message deleted", { icon: "💨" });
		}
	};

	const handleQuickDelete = async () => {
		if (!fromMe) return;
		// Remove message instantly from UI
		onDelete();
		// Then delete from backend silently
		await deleteMessage(message._id);
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (pressTimerRef.current) {
				clearTimeout(pressTimerRef.current);
			}
		};
	}, []);

	return (
		<div className={`chat ${fromMe ? "chat-end" : "chat-start"} fade-in relative`}>
			{showDeleteBtn && (
				<button
					onClick={handleQuickDelete}
					className="absolute -top-8 left-0 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full animate-pulse z-10 font-medium"
				>
					Delete
				</button>
			)}
			
			<div className="chat-image avatar">
				<div className={`w-8 rounded-full overflow-hidden ${isFromSoha ? "soha-avatar-glow" : isFromHasnain ? "hasnain-avatar-glow" : ""}`}>
					<img alt="Profile" src={profilePic} className="w-full h-full object-cover" />
				</div>
			</div>
			
			<div 
				className={`message-bubble chat-bubble max-w-[75%] rounded-2xl px-4 py-2.5 cursor-pointer ${
					fromMe 
						? "bg-gray-900 text-white" 
						: isFromSoha 
							? "bg-gradient-to-r from-pink-100 to-rose-100 text-gray-900 border border-pink-200 soha-message"
							: isFromHasnain
								? "bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 border border-blue-200 hasnain-message"
								: "bg-gray-100 text-gray-900"
				}`}
				onMouseDown={handlePressStart}
				onMouseUp={handlePressEnd}
				onMouseLeave={handlePressEnd}
				onTouchStart={handlePressStart}
				onTouchEnd={handlePressEnd}
			>
				<p className="text-sm leading-relaxed">{message.message}</p>
			</div>
			
			<div className={`chat-footer text-xs mt-1 ${
				isFromSoha ? "text-pink-400" : isFromHasnain ? "text-blue-400" : "text-gray-400"
			}`}>
				{formattedTime}
				{isFromSoha && <span className="ml-1">💕</span>}
			</div>
		</div>
	);
};
export default Message;
