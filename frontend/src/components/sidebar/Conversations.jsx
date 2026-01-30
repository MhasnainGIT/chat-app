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
