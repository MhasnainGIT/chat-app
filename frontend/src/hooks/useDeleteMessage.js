import { useState } from "react";

const useDeleteMessage = () => {
	const [loading, setLoading] = useState(false);

	const deleteMessage = async (messageId, onSuccess) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/messages/delete/${messageId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (data.error) {
				throw new Error(data.error);
			}
			// Call the success callback to remove from UI immediately
			if (onSuccess) {
				onSuccess();
			}
			return true;
		} catch (error) {
			console.error("Error deleting message:", error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { deleteMessage, loading };
};

export default useDeleteMessage;
