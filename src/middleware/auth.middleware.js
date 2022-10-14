import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization;
		if (!authorization) {
			return res.status(401).json({ message: "Access Denied" });
		}
		const authenticationArr = authorization.split(" ");
		if (authenticationArr[0] !== "Bearer") {
			return res.status(401).json({ message: "Access Denied" });
		}
		const token = authenticationArr[1];
		if (!token) {
			return res.status(401).json({ message: "Access Denied" });
		}
		Jwt.verify(token, process.env.SECRET, (err, payload) => {
			if (err) {
				return res.status(400).json({message: "Bad Request"});
			} else {
				req.userId = payload.id;
			}
		});

		next();
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

export default { authenticate };
