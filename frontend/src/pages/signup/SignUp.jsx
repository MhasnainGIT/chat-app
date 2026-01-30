import { useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";

const questions = [
	{
		id: "fullName",
		question: "What's your beautiful name?",
		subtext: "We promise to call you by this name always 💕",
		placeholder: "Enter your full name",
		type: "text",
	},
	{
		id: "username",
		question: "Choose a unique username",
		subtext: "This is how others will find you on the app",
		placeholder: "Create a username",
		type: "text",
	},
	{
		id: "gender",
		question: "Who are you?",
		subtext: "Help us personalize your experience",
		type: "gender",
	},
	{
		id: "phone",
		question: " phone number? 📱",
		subtext: "To stay connected.",
		placeholder: "+1234567890",
		type: "tel",
	},
	{
		id: "password",
		question: "Create a secure password",
		subtext: "Keep it safe!",
		placeholder: "Create a password",
		type: "password",
	},
	{
		id: "confirmPassword",
		question: "Confirm your password",
		subtext: "One more time to make sure!",
		placeholder: "Confirm password",
		type: "password",
	},
];

const characters = [
	{ name: "Cute Bear", emoji: "🐻", color: "from-amber-100 to-orange-100" },
	{ name: "Sweet Cat", emoji: "🐱", color: "from-purple-100 to-pink-100" },
	{ name: "Happy Bunny", emoji: "🐰", color: "from-pink-100 to-rose-100" },
	{ name: "Cool Owl", emoji: "🦉", color: "from-blue-100 to-indigo-100" },
	{ name: "Love Panda", emoji: "🐼", color: "from-gray-100 to-slate-100" },
	{ name: "Star Bunny", emoji: "🌟", color: "from-yellow-100 to-amber-100" },
];

const SignUp = () => {
	const [step, setStep] = useState(0);
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
		phone: "",
	});
	const { loading, signup } = useSignup();
	const [error, setError] = useState("");

	const currentQ = questions[step];
	const character = characters[step % characters.length];

	// Real-time password match check
	const getPasswordMatchStatus = () => {
		if (!inputs.confirmPassword) return null;
		if (inputs.password === inputs.confirmPassword) return "match";
		return "mismatch";
	};

	const handleNext = () => {
		// Validate current step
		if (!inputs[currentQ.id] && currentQ.type !== "gender") {
			setError(`Please enter your ${currentQ.id}`);
			return;
		}
		if (currentQ.id === "phone" && inputs[currentQ.id].length < 10) {
			setError("Please enter a valid phone number (at least 10 digits)");
			return;
		}
		if (currentQ.id === "password" && inputs[currentQ.id].length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}
		if (currentQ.id === "confirmPassword") {
			if (inputs[currentQ.id] !== inputs.password) {
				setError("Passwords do not match!");
				return;
			}
		}
		setError("");
		setStep(step + 1);
	};

	const handlePrev = () => {
		setStep(step - 1);
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (inputs.password !== inputs.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}
		await signup(inputs);
	};

	const handleChange = (e) => {
		setInputs({ ...inputs, [currentQ.id]: e.target.value });
		setError("");
	};

	const handleGenderChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
			<div className="w-full max-w-lg">
				{/* Progress Bar */}
				<div className="mb-6">
					<div className="flex justify-between text-xs text-gray-400 mb-2">
						<span>Step {step + 1} of {questions.length + 1}</span>
						<span>{Math.round(((step + 1) / (questions.length + 1)) * 100)}%</span>
					</div>
					<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div 
							className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
							style={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }}
						></div>
					</div>
				</div>

				<div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
					{/* Character Header */}
					<div className={`bg-gradient-to-br ${character.color} p-8 text-center relative overflow-hidden`}>
						<div className="absolute top-0 right-0 text-6xl opacity-20 transform translate-x-4 -translate-y-4">
							{character.emoji}
						</div>
						<div className="relative z-10">
							<div className="text-6xl mb-4 animate-bounce">{character.emoji}</div>
							<p className="text-sm text-gray-600 font-medium">{character.name} is here to help!</p>
						</div>
					</div>

					{/* Question Content */}
					<div className="p-8">
						{step >= questions.length ? (
							/* Final Step - Show all info and submit */
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="text-center mb-6">
									<h2 className="text-2xl font-bold text-gray-800 mb-2">Almost done! 🎉</h2>
									<p className="text-gray-500">Review your details and create your account</p>
								</div>

								<div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-500">Name</span>
										<span className="font-medium">{inputs.fullName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Username</span>
										<span className="font-medium">@{inputs.username}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Phone</span>
										<span className="font-medium">{inputs.phone}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Gender</span>
										<span className="font-medium capitalize">{inputs.gender}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-500">Password</span>
										<span className={`font-medium ${!inputs.confirmPassword ? "text-yellow-500" : inputs.password === inputs.confirmPassword ? "text-green-500" : "text-red-500"}`}>
											{!inputs.confirmPassword ? "⚠ Not entered" : inputs.password === inputs.confirmPassword ? "✓ Matching" : "✗ Not matching"}
										</span>
									</div>
								</div>

								{error && (
									<div className="text-red-500 text-sm text-center">{error}</div>
								)}

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={handlePrev}
										className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-smooth"
									>
										← Back
									</button>
									<button
										type="submit"
										disabled={loading}
										className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-smooth disabled:opacity-50"
									>
										{loading ? (
											<span className="flex items-center justify-center gap-2">
												<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Creating...
											</span>
										) : (
											"Create Account"
										)}
									</button>
								</div>
							</form>
						) : (
							/* Regular Question Step */
							<>
								<div className="text-center mb-6">
									<h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
									<p className="text-gray-500">{currentQ.subtext}</p>
								</div>

								{currentQ.type === "gender" ? (
									<div className="flex gap-4 justify-center py-4">
										<label className={`flex items-center gap-2 px-6 py-4 rounded-xl border-2 cursor-pointer transition-smooth ${
											inputs.gender === "male" 
												? "border-blue-500 bg-blue-50" 
												: "border-gray-200 hover:border-gray-300"
										}`}>
											<input
												type="radio"
												name="gender"
												value="male"
												checked={inputs.gender === "male"}
												onChange={() => handleGenderChange("male")}
												className="hidden"
											/>
											<span className="text-2xl">👦</span>
											<span className="font-medium">Male</span>
										</label>
										<label className={`flex items-center gap-2 px-6 py-4 rounded-xl border-2 cursor-pointer transition-smooth ${
											inputs.gender === "female" 
												? "border-pink-500 bg-pink-50" 
												: "border-gray-200 hover:border-gray-300"
										}`}>
											<input
												type="radio"
												name="gender"
												value="female"
												checked={inputs.gender === "female"}
												onChange={() => handleGenderChange("female")}
												className="hidden"
											/>
											<span className="text-2xl">👧</span>
											<span className="font-medium">Female</span>
										</label>
									</div>
								) : (
									<div className="relative">
										<input
											type={currentQ.type}
											placeholder={currentQ.placeholder}
											value={inputs[currentQ.id] || ""}
											onChange={handleChange}
											className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 transition-smooth text-center text-lg ${
												currentQ.id === "confirmPassword" && inputs.confirmPassword
													? inputs.password === inputs.confirmPassword
														? "border-green-300 bg-green-50"
														: "border-red-300 bg-red-50"
													: "border-gray-200"
											}`}
										/>
										
										{/* Real-time password match indicator */}
										{currentQ.id === "confirmPassword" && inputs.confirmPassword && (
											<div className="absolute right-4 top-1/2 -translate-y-1/2">
												{inputs.password === inputs.confirmPassword ? (
													<span className="text-green-500 text-xl">✓</span>
												) : (
													<span className="text-red-500 text-xl">✗</span>
												)}
											</div>
										)}
									</div>
								)}

								{error && (
									<div className="text-red-500 text-sm text-center mt-2">{error}</div>
								)}

								<div className="flex gap-3 pt-6">
									{step > 0 && (
										<button
											onClick={handlePrev}
											className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-smooth"
										>
											← Back
										</button>
									)}
									<button
										onClick={handleNext}
										className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-smooth"
									>
										{step === questions.length - 1 ? "Review →" : "Next →"}
									</button>
								</div>
							</>
						)}

						<p className="text-center text-gray-500 mt-6 text-sm">
							Already have an account?{" "}
							<Link to="/login" className="text-blue-500 font-medium hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUp;
