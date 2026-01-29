import { useState } from "react";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
	const [loading, setLoading] = useState(false);

	const updateProfile = async (profilePic) => {
		setLoading(true);
		try {
			const response = await fetch("/api/users/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ profilePic }),
			});
			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}
			toast.success("Profile picture updated!");
			return data;
		} catch (error) {
			toast.error(error.message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { updateProfile, loading };
};

export default useUpdateProfile;
