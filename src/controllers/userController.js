import { v4 } from "uuid";
import db from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate from "../middleware/validate.middleware.js";
import smtp from "../../utils/sendMail.js";
import {
	allUsers,
	checkEmail,
	findUser,
	getUser,
	loginUser,
	newUser,
	removeUser,
	updateVerified,
	verifyMail,
} from "../../utils/queries.js";

// Fetch all Users
const getAllUsers = (_, res) => {
	db.query(allUsers, (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}
		return res.status(200).json(rows);
	});
};

// Add a new User
const createUser = async (req, res) => {
	const { first_name, last_name, email, phone_number, password } = req.body;
	const hashPassword = await bcrypt.hash(password, 10);

	// validating reg.body with joi
	await validate.validateSignUP.validateAsync(req.body);

	// checking if a user already has an account
	db.query(checkEmail, [req.body.email], (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}

		if (rows.length) {
			return res.status(400).json({
				message: "User already exist",
			});
		}

		// creating a new user
		const users = {
			id: v4(),
			first_name: first_name,
			last_name: last_name,
			email: email,
			phone_number: phone_number,
			password: hashPassword,
		};
		db.query(
			newUser,
			[
				users.id,
				users.first_name,
				users.last_name,
				users.email,
				users.phone_number,
				users.password,
			],
			(err, _) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message:
							"An error occurred, please contact the system Admin",
					});
				}
				// creating a payload
				const payload = {
					id: users.id,
					email: users.email,
				};

				const token = jwt.sign(payload, process.env.SECRET, {
					expiresIn: "2h",
				});
				let mailOptions = {
					from: process.env.user,
					to: users.email,
					subject: "Verify Email",
					text: `Hi ${first_name}, Please verify your email.
		   ${token}`,
				};
				smtp.sendMail(mailOptions);
				return res
					.status(201)
					.json({ message: "User created", token: token });
			}
		);
	});
};

// verifying Email
const verifyEmail = async (req, res) => {
	const { token } = req.query;
	jwt.verify(token, process.env.SECRET, (err, payload) => {
		if (err) {
			return res.status(400).json({ message: "Bad Request" });
		}
		req.email = payload.email;
	});
	db.query(verifyMail, [req.email], (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}

		if (rows[0].is_verified) {
			return res.status(200).json({
				message: "user verified already",
			});
		}
		db.query(updateVerified, [req.email]);
		return res.status(200).json({ message: "User verified successfully" });
	});
};

// logging in a user
const login = async (req, res) => {
	const { email, password } = req.body;

	// validate with joi
	await validate.validateSignIn.validateAsync(req.body);

	//  checking email and password match
	if (email && password) {
		db.query(loginUser, [email], (err, rows) => {
			if (err) {
				return res.status(500).json({
					message:
						"An error occurred, please contact the system Admin",
				});
			}
			if (!rows.length) {
				return res.status(400).json({
					message: "email address not found.",
				});
			}
			const passMatch = bcrypt.compare(password, rows[0].password);
			if (!passMatch) {
				return res.status(400).json({ message: "incorrect details" });
			}
			if (!rows[0].is_verified) {
				return res.status(400).json({
					message: "Unverified account.",
				});
			}

			// creating a payload
			const payload = {
				id: rows[0].id,
				email: rows[0].email,
			};

			const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
				expiresIn: "1h",
			});
			return res.status(200).json({
				message: "User logged in successfully",
				token: token,
			});
		});
	}
};

// Get User By ID
const getAUser = (req, res) => {
	const { id } = req.params;
	db.query(getUser, [id], (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}
		if (!rows.length) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		if (rows[0].id !== req.userId) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		return res.status(200).json(rows);
	});
};

// Update User By ID
const updateUser = async (req, res) => {
	const { id } = req.params;
	const { first_name, last_name, phone_number, password } = req.body;
	db.query(findUser, [id], (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}
		if (!rows.length) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		if (rows[0].id !== req.userId) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		if (first_name) {
			db.query("UPDATE users SET first_name = ? WHERE id = ?", [
				first_name,
				id,
			]);
		}
		if (last_name) {
			db.query("UPDATE users SET last_name WHERE id = ?", [id]);
		}
		if (phone_number) {
			db.query("UPDATE users SET phone_number WHERE id = ?", [
				phone_number,
				id,
			]);
		}
		if (password) {
			const hashPassword = bcrypt.hash(password, 10);
			db.query("UPDATE users SET password WHERE id = ?", [
				hashPassword,
				id,
			]);
		}
		return res.status(200).json({
			message: "Update was successful",
		});
	});
};

// Delete User By ID
const deleteUser = async (req, res) => {
	const { id } = req.params;
	db.query(getUser, [id], (err, rows) => {
		if (err) {
			return res.status(500).json({
				message: "An error occurred, please contact the system Admin",
			});
		}
		if (!rows.length) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		if (rows[0].id !== req.userId) {
			return res.status(403).json({ message: "Unauthorized" });
		}
		db.query(removeUser, [id]);
		return res.status(410).json({
			message: "User successfully deleted",
		});
	});
};

export default {
	createUser,
	verifyEmail,
	login,
	getAllUsers,
	getAUser,
	updateUser,
	deleteUser,
};
