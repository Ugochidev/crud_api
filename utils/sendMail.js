import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (config) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 465,
			secure: true,
			auth: {
				user: process.env.userEmail,
				pass: process.env.userPassword,
			},
			tls: {
			  rejectUnauthorized: false,
			},
		});
		const info = await transporter.sendMail({
			...config,
		});

		console.log(`Preview URL: %s`, nodemailer.getTestMessageUrl(info));
	} catch (error) {
		console.log(error.message);
	}
};

export default { sendMail };
