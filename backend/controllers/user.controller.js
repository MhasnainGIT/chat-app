import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body;
		const userId = req.user._id;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic },
			{ new: true }
		).select("-password");

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateProfile: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
