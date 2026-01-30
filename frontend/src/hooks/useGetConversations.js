import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	const getConversations = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/users`, { credentials: "include" });
			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: res.statusText }));
				throw new Error(err.error || `Request failed (${res.status})`);
			}
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			setConversations(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Initial fetch
		getConversations();

		// Auto-refresh every 10 seconds to check for new users
		const interval = setInterval(() => {
			getConversations();
		}, 10000);

		return () => clearInterval(interval);
	}, []);

	return { loading, conversations, refreshConversations: getConversations };
};
export default useGetConversations;
