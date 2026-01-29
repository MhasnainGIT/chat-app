import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import ProfileModal from "../sidebar/ProfileModal";
import { useAuthContext } from "../../context/AuthContext";

// Special usernames
const SOHA_USERNAME = "soha";
const HASNAIN_USERNAME = "hasnain";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const isSoha = selectedConversation?.username?.toLowerCase() === SOHA_USERNAME;
	const isHasnain = selectedConversation?.username?.toLowerCase() === HASNAIN_USERNAME;
	const [showProfileModal, setShowProfileModal] = useState(false);

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleCall = () => {
		if (selectedConversation?.phone) {
			window.location.href = `tel:${selectedConversation.phone}`;
		} else {
			alert("This user doesn't have a phone number registered.");
		}
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
			{!selectedConversation ? (
				<NoChatSelected onOpenProfile={() => setShowProfileModal(true)} />
			) : (
				<>
					{/* Header with appropriate theme */}
					<div className={`flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10 ${
						isSoha ? "soha-header" : isHasnain ? "hasnain-header" : "border-gray-100"
					}`}>
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className={`w-10 h-10 rounded-full overflow-hidden ${
									isSoha ? "soha-avatar-glow" : isHasnain ? "hasnain-avatar-glow" : ""
								}`}>
									<img
										src={`https://avatar.iran.liara.run/public/${selectedConversation.gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(selectedConversation.username)}`}
										alt={selectedConversation.username}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
									isSoha ? "soha-online" : isHasnain ? "hasnain-online" : "bg-green-500"
								}`}></div>
							</div>
							<div className={isSoha ? "sparkle" : ""}>
								<h3 className="font-medium text-gray-900">{selectedConversation.fullName}</h3>
								<p className="text-xs text-gray-500">@{selectedConversation.username}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={handleCall}
								className={`p-2 rounded-full transition-smooth ${
									isSoha 
										? "text-pink-500 hover:text-pink-600 hover:bg-pink-50" 
										: isHasnain
											? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
											: "text-gray-400 hover:text-green-600 hover:bg-green-50"
								}`}
								title={selectedConversation.phone ? `Call ${selectedConversation.phone}` : "No phone number"}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
								</svg>
							</button>
							<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-smooth">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
								</svg>
							</button>
						</div>
					</div>

					<Messages isSoha={isSoha} isHasnain={isHasnain} />
					<MessageInput />
				</>
			)}

			{/* Profile Modal */}
			<ProfileModal
				isOpen={showProfileModal}
				onClose={() => setShowProfileModal(false)}
			/>
		</div>
	);
};

const NoChatSelected = ({ onOpenProfile }) => {
	const { authUser } = useAuthContext();
	const isSoha = authUser?.username?.toLowerCase() === SOHA_USERNAME;
	const isHasnain = authUser?.username?.toLowerCase() === HASNAIN_USERNAME;

	return (
		<div className={`flex flex-col items-center flex-1 text-center p-8 relative ${isSoha ? "soha-welcome" : ""}`}>
			{isSoha && (
				<>
					<div className="floating-heart" style={{ left: '10%', animationDelay: '0s' }}>💕</div>
					<div className="floating-heart" style={{ left: '30%', animationDelay: '2s' }}>💖</div>
					<div className="floating-heart" style={{ left: '70%', animationDelay: '4s' }}>💗</div>
					<div className="floating-heart" style={{ left: '90%', animationDelay: '6s' }}>💝</div>
				</>
			)}
			
			{/* Profile Section Above */}
			<button
				onClick={onOpenProfile}
				className="flex flex-col items-center mb-6 group"
			>
				<div className={`relative mb-3 ${isSoha ? "soha-avatar-glow" : isHasnain ? "hasnain-avatar-glow" : ""}`}>
					<img
						src={authUser?.profilePic || `https://avatar.iran.liara.run/public/${authUser?.gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(authUser?.username)}`}
						alt={authUser?.fullName}
						className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all"
					/>
					<div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg">
						📷
					</div>
				</div>
				<h2 className={`text-xl font-semibold group-hover:transition-colors ${
					isSoha ? "text-pink-500" : isHasnain ? "text-blue-600" : "text-gray-800"
				}`}>
					{isSoha ? "✨ SOHA ✨" : isHasnain ? "HASNAIN" : authUser?.fullName}
				</h2>
				<p className="text-sm text-gray-500">@{authUser?.username}</p>
				<p className="text-xs text-blue-400 mt-1">Tap to edit profile</p>
			</button>

			<div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
				isSoha ? "bg-pink-100" : isHasnain ? "bg-blue-100" : "bg-gray-100"
			}`}>
				<svg className={`w-10 h-10 ${isSoha ? "text-pink-500" : isHasnain ? "text-blue-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
				</svg>
			</div>
			<h2 className="text-xl font-semibold text-gray-800 mb-2">
				{isSoha ? "Welcome back, SOHA! 💕" : isHasnain ? "Welcome back, Hasnain!" : `Welcome, ${authUser?.fullName}`}
			</h2>
			<p className="text-gray-500 max-w-sm">
				{isSoha 
					? "Select a conversation to start chatting 💕"
					: isHasnain
						? "Select a conversation to start chatting"
						: "Select a conversation from the sidebar to start messaging"}
			</p>
		</div>
	);
};

export default MessageContainer;
