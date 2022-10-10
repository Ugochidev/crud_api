import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization;
		if (!authorization) {
			return res.status(401).json({ message: "Token is required" });
		}
		const authenticationArr = authorization.split(" ");
		if (authenticationArr[0] !== "Bearer") {
			return res.status(401).json({ message: "Bearer is required" });
		}
		const token = authenticationArr[1];
		if (!token) {
			return res.status(401).json({ message: "Bearer is required" });
		}
		const decryptToken = await Jwt.verify(token, process.env.SECRET, {
			expiresIn: "10mins",
		});
		req.user = decryptToken;
		next();
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const authorize = async (req, res, next) => {
	try {
		if (req.user.role == "Admin") {
			next();
		} else {
			return res.status(401).json({ message: "User not allowed" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export default { authenticate, authorize };
