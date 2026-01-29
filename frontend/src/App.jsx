import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
	const { authUser } = useAuthContext();
	return (
		<div className="min-h-screen bg-gray-100">
			<Routes>
				<Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
				<Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
			</Routes>
			<Toaster
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
						borderRadius: "8px",
					},
				}}
			/>
		</div>
	);
}

export default App;
