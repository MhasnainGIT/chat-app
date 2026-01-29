import jwt from "jsonwebtoken";

// Ensure we have a JWT secret. Provide a clear error in production and a
// safe fallback for development to avoid unhelpful runtime errors.
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

const generateTokenAndSetCookie = (userId, res) => {
	const secret = getJwtSecret();
	const token = jwt.sign({ userId }, secret, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
		secure: process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;
