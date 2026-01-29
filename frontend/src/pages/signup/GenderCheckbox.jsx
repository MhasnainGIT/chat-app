const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className="flex gap-4">
			<label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-smooth ${
				selectedGender === "male"
					? "border-gray-900 bg-gray-50"
					: "border-gray-200 hover:border-gray-300"
			}`}>
				<input
					type="checkbox"
					className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
					checked={selectedGender === "male"}
					onChange={() => onCheckboxChange("male")}
				/>
				<span className="text-sm font-medium text-gray-700">Male</span>
			</label>
			<label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-smooth ${
				selectedGender === "female"
					? "border-gray-900 bg-gray-50"
					: "border-gray-200 hover:border-gray-300"
			}`}>
				<input
					type="checkbox"
					className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
					checked={selectedGender === "female"}
					onChange={() => onCheckboxChange("female")}
				/>
				<span className="text-sm font-medium text-gray-700">Female</span>
			</label>
		</div>
	);
};
export default GenderCheckbox;
