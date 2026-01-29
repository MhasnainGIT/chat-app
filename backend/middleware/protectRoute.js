import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Helper to safely get JWT secret with clear behavior in production vs dev
const getJwtSecret = () => {
	if (!process.env.JWT_SECRET) {
		if (process.env.NODE_ENV === "production") {
			throw new Error("JWT_SECRET must be set in production environment");
		}
		console.warn("Warning: JWT_SECRET is not set. Using development fallback secret.");
		return "dev-secret";
	}
	return process.env.JWT_SECRET;
};

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const secret = getJwtSecret();
		const decoded = jwt.verify(token, secret);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
