import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className="flex w-full h-screen overflow-hidden bg-gray-100">
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
