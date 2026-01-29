import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";

const avatarOptions = [
	// Liaora avatars
	"https://avatar.iran.liara.run/public/boy?username=avatar",
	"https://avatar.iran.liara.run/public/girl?username=avatar",
	"https://avatar.iran.liara.run/public/boy?username=bear",
	"https://avatar.iran.liara.run/public/girl?username=cat",
	"https://avatar.iran.liara.run/public/boy?username=happy",
	"https://avatar.iran.liara.run/public/girl?username=cute",
	// DiceBear avatars
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Ginger",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Annie",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Cooper",
	"https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
	// Pixel art avatars
	"https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1",
	"https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel2",
	"https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel3",
	"https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel4",
	// Notion avatars
	"https://api.dicebear.com/7.x/notionists/svg?seed=Notion1",
	"https://api.dicebear.com/7.x/notionists/svg?seed=Notion2",
	// Bottts avatars
	"https://api.dicebear.com/7.x/bottts/svg?seed=Bot1",
	"https://api.dicebear.com/7.x/bottts/svg?seed=Bot2",
];

const ProfileModal = ({ isOpen, onClose }) => {
	const { authUser, setAuthUser } = useAuthContext();
	const { updateProfile, loading } = useUpdateProfile();
	const [selectedAvatar, setSelectedAvatar] = useState(authUser?.profilePic || "");

	const handleSelectAvatar = (url) => {
		setSelectedAvatar(url);
	};

	const handleSave = async () => {
		const updatedUser = await updateProfile(selectedAvatar);
		if (updatedUser) {
			setAuthUser(updatedUser);
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">Update Profile</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 text-2xl"
					>
						×
					</button>
				</div>

				{/* Current/Selected Avatar Preview */}
				<div className="flex justify-center mb-6">
					<div className="relative">
						<img
							src={selectedAvatar || `https://avatar.iran.liara.run/public/${authUser?.gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(authUser?.username)}`}
							alt="Profile"
							className="w-28 h-28 rounded-full object-cover ring-4 ring-pink-200"
						/>
						<div className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">
							📷
						</div>
					</div>
				</div>

				<p className="text-center text-gray-500 text-sm mb-4">
					Choose an avatar that represents you
				</p>

				{/* Avatar Options */}
				<div className="grid grid-cols-4 gap-3 mb-6">
					{avatarOptions.map((avatar, idx) => (
						<button
							key={idx}
							onClick={() => handleSelectAvatar(avatar)}
							className={`relative rounded-xl overflow-hidden transition-all ${
								selectedAvatar === avatar
									? "ring-2 ring-pink-500 ring-offset-2"
									: "hover:ring-2 hover:ring-gray-300"
							}`}
						>
							<img
								src={avatar}
								alt={`Avatar ${idx + 1}`}
								className="w-full h-16 object-cover"
							/>
							{selectedAvatar === avatar && (
								<div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
									<span className="text-white text-lg font-bold">✓</span>
								</div>
							)}
						</button>
					))}
				</div>

				{/* Custom URL Input */}
				<div className="mb-6">
					<label className="block text-sm text-gray-600 mb-2">Or paste a custom image URL</label>
					<input
						type="url"
						placeholder="https://example.com/your-photo.jpg"
						value={selectedAvatar.startsWith("http") && !avatarOptions.includes(selectedAvatar) ? selectedAvatar : ""}
						onChange={(e) => setSelectedAvatar(e.target.value)}
						className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
					/>
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-smooth"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={loading || !selectedAvatar}
						className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 transition-smooth disabled:opacity-50"
					>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
