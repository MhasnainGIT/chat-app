import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: false,
			unique: true,
			sparse: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		phone: {
			type: String,
			required: true, // Now required!
			unique: true,
			sparse: true,
			trim: true,
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
