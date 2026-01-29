import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search.trim()) return;

		const found = conversations.find((c) =>
			c.fullName.toLowerCase().includes(search.toLowerCase())
		);

		if (found) {
			setSelectedConversation(found);
			setSearch("");
			toast.success(`Found ${found.fullName}`);
		} else {
			toast.error("User not found");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center">
			<input
				type="text"
				placeholder="Search conversations..."
				className="w-full input input-bordered bg-gray-50 border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-gray-400 transition-smooth"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<IoSearchSharp className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
			<button
				type="submit"
				className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-smooth"
			>
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</button>
		</form>
	);
};

export default SearchInput;
