import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form className="px-4 py-3 border-t border-gray-100 bg-white" onSubmit={handleSubmit}>
			<div className="flex items-center gap-2">
				<input
					type="text"
					className="flex-1 input input-bordered bg-gray-50 border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:bg-white focus:border-gray-400 transition-smooth text-sm"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					type="submit"
					disabled={!message.trim() || loading}
					className="btn btn-circle bg-gray-900 text-white border-none hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-smooth btn-press"
				>
					{loading ? (
						<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					) : (
						<BsSend className="w-5 h-5" />
					)}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
