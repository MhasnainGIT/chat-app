import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileModal from "./ProfileModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const { authUser } = useAuthContext();

	return (
		<>
			{/* Mobile toggle button */}
			<button
				className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2 rounded-lg shadow-md hover:bg-gray-50 transition-smooth"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? <HiX size={20} /> : <HiMenuAlt2 size={20} />}
			</button>

			<motion.div
				initial={{ x: "-100%" }}
				animate={{ x: isOpen || window.innerWidth >= 768 ? 0 : "-100%" }}
				transition={{ type: "spring", damping: 25, stiffness: 200 }}
				className="fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-sm z-40 overflow-y-auto md:overflow-visible"
			>
				<div className="flex flex-col h-full">
					{/* Header with Profile */}
					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
							</div>
							<h1 className="text-xl font-semibold text-gray-800">Messages</h1>
						</div>
					</div>

					{/* Profile Section */}
					<div className="p-4 border-b border-gray-100">
						<button
							onClick={() => setShowProfileModal(true)}
							className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-smooth"
						>
							<div className="relative">
								<img
									src={authUser?.profilePic || `https://avatar.iran.liara.run/public/${authUser?.gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(authUser?.username)}`}
									alt={authUser?.fullName}
									className="w-10 h-10 rounded-full object-cover"
								/>
								<div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
									<span className="text-white text-[8px]">✏️</span>
								</div>
							</div>
							<div className="flex-1 text-left">
								<p className="font-medium text-gray-900 text-sm">{authUser?.fullName}</p>
								<p className="text-xs text-gray-500">@{authUser?.username}</p>
							</div>
						</button>
					</div>

					<div className="p-4">
						<SearchInput />
					</div>

					<div className="flex-1 overflow-y-auto">
						<Conversations />
					</div>

					<div className="p-4 border-t border-gray-100">
						<LogoutButton />
					</div>
				</div>
			</motion.div>

			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="md:hidden fixed inset-0 bg-black/20 z-30"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Profile Modal */}
			<ProfileModal
				isOpen={showProfileModal}
				onClose={() => setShowProfileModal(false)}
			/>
		</>
	);
};

export default Sidebar;
