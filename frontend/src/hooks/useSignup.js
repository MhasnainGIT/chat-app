import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender, phone }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender, phone });
		if (!success) return;

		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/auth/signup`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender, phone }),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ error: res.statusText }));
				throw new Error(err.error || `Request failed (${res.status})`);
			}

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			} 
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender, phone }) {
	if (!fullName || !username || !password || !confirmPassword || !gender || !phone) {
		toast.error("Please fill in all fields including phone number");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	// Phone validation - accept various formats
	const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
	if (!phoneRegex.test(phone)) {
		toast.error("Enter a valid phone number (e.g., +1234567890 or 1234567890)");
		return false;
	}

	return true;
}
