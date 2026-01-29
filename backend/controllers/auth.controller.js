import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import mongoose from 'mongoose';

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender, phone, email } = req.body || {};

		if (mongoose.connection.readyState !== 1) {
			return res.status(503).json({ error: "Database unavailable. Please try later." });
		}

		if (!fullName || !username || !password || !confirmPassword || !gender || !phone) {
			return res.status(400).json({
				error: "All required fields are missing",
				required: ["fullName", "username", "password", "confirmPassword", "gender", "phone"],
			});
		}

		// Trim passwords to avoid whitespace issues
		const trimmedPassword = password.trim();
		const trimmedConfirmPassword = confirmPassword.trim();

		if (trimmedPassword !== trimmedConfirmPassword) {
			return res.status(400).json({ error: "Passwords do not match" });
		}

		if (trimmedPassword.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters" });
		}

		// Phone validation - accept various formats
		const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
		if (!phoneRegex.test(phone)) {
			return res.status(400).json({ error: "Invalid phone number format" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username already exists" });
		}

		const existingPhone = await User.findOne({ phone });
		if (existingPhone) {
			return res.status(400).json({ error: "Phone number already in use" });
		}

		// Optional: also check email if provided
		if (email) {
			const existingEmail = await User.findOne({ email });
			if (existingEmail) {
				return res.status(400).json({ error: "Email already in use" });
			}
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

		const profilePicBaseUrl = `https://avatar.iran.liara.run/public/`;
		const profilePic = gender === "male"
			? `${profilePicBaseUrl}boy?username=${username}`
			: `${profilePicBaseUrl}girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic,
			phone: phone.trim(),
			email: email || undefined,
		});

		await newUser.save();

		generateTokenAndSetCookie(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			username: newUser.username,
			profilePic: newUser.profilePic,
			phone: newUser.phone || null,
			email: newUser.email || null,
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		console.log("[LOGIN] Request body:", req.body);

		const { username, email, password } = req.body || {};

		// Allow login with username OR email
		const loginField = username || email;

		if (!loginField || !password) {
			return res.status(400).json({
				error: "Username/email and password are required",
				received: req.body,
			});
		}

		if (mongoose.connection.readyState !== 1) {
			return res.status(503).json({ error: "Database unavailable. Please try later." });
		}

		// Try to find by username first, then by email
		let user = await User.findOne({ username: loginField });
		if (!user) {
			user = await User.findOne({ email: loginField });
		}

		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Trim password for comparison
		const trimmedPassword = password.trim();
		const isPasswordCorrect = await bcrypt.compare(trimmedPassword, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
			phone: user.phone || null,
			email: user.email || null,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const logout = (req, res) => {
	try {
		res.clearCookie("jwt");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Logout error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
