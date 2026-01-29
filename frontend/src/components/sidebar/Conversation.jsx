import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const SOHA_USERNAME = "soha";
const HASNAIN_USERNAME = "hasnain";

const Conversation = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);
	const isSoha = conversation.username?.toLowerCase() === SOHA_USERNAME;
	const isHasnain = conversation.username?.toLowerCase() === HASNAIN_USERNAME;

	return (
		<>
			<div
				className={`sidebar-item flex gap-3 items-center px-4 py-3 cursor-pointer transition-smooth border-l-2 ${
					isSelected
						? isSoha 
							? "bg-pink-50 border-l-pink-400" 
							: isHasnain
								? "bg-blue-50 border-l-blue-500"
								: "bg-gray-50 border-l-gray-900"
						: isSoha 
							? "hover:bg-pink-50 border-l-transparent"
							: isHasnain
								? "hover:bg-blue-50 border-l-transparent"
								: "hover:bg-gray-50 border-l-transparent"
				}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className="relative">
					<div className={`w-11 h-11 rounded-full overflow-hidden ${
						isSoha ? "soha-avatar-glow" : isHasnain ? "hasnain-avatar-glow" : ""
					}`}>
						<img
							src={conversation.profilePic || `https://avatar.iran.liara.run/public/${conversation.gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(conversation.username)}`}
							alt={conversation.fullName}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
						isSoha ? "soha-online" : isHasnain ? "hasnain-online" : isOnline ? "bg-green-500" : "bg-gray-300"
					}`}></div>
				</div>

				<div className="flex-1 min-w-0">
					<p className={`font-medium truncate ${
						isSoha ? "text-gray-900" : isHasnain ? "text-gray-900" : "text-gray-900"
					}`}>
						{conversation.fullName}
						{isSoha && <span className="ml-1">💕</span>}
					</p>
					<p className="text-sm text-gray-500 truncate">@{conversation.username}</p>
				</div>

				{isSoha && (
					<span className="text-xs text-pink-500 font-medium">Special</span>
				)}
				{isHasnain && !isSoha && (
					<span className="text-xs text-blue-500 font-medium">Friend</span>
				)}
				{!isSoha && !isHasnain && isOnline && (
					<span className="text-xs text-green-600 font-medium">Online</span>
				)}
			</div>

			{!lastIdx && <div className="mx-4 border-t border-gray-100" />}
		</>
	);
};
export default Conversation;
