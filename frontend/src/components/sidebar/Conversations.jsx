import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="flex flex-col">
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading && (
				<div className="flex justify-center items-center py-8">
					<div className="flex items-center gap-2 text-gray-400">
						<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span className="text-sm">Loading...</span>
					</div>
				</div>
			)}

			{conversations.length === 0 && !loading && (
				<div className="text-center py-8">
					<p className="text-gray-500">No conversations yet</p>
					<p className="text-sm text-gray-400 mt-1">Start a new conversation to begin chatting</p>
				</div>
			)}
		</div>
	);
};

export default Conversations;
