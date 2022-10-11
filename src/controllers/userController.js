import db from "../database/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"



const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_number, password } = req.body;
    // validating reg.body with joi
    await validiateUser.validateAsync(req.body);
    // checking if a user already has an account
    const user = await db.execute(
      "SELECT `email` FROM `users` WHERE `email` = ?",
      [req.body.email]
    );

    if (user) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    //  hashing password
    const hashPassword = await bcrypt.hash(password, 10);
    const id = uuid.v4();

    // creating a new user
    const newUser = await db.execute(
      "INSERT INTO users ( id, first_name, last_name, is_verified, role,  email, phone_number, password) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        first_name,
        last_name,
        is_verified,
        role,
        email,
        phone_number,
        hashPassword,
      ]
    );

    // creating a payload
    const payload = {
      id: newUser.id,
      email: req.body.email,
      role: req.body.role,
      isVerified: req.body.isVerified,
    };
    const token = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: "2h",
    });

    //  verifying email address with nodemailer
    let mailOptions = {
      to: newUser.email,
      subject: "Verify Email",
      text: `Hi ${firstName}, Pls verify your email.
       ${token}`,
    };
    sendMail(mailOptions);
    return res.status(201).json({ message: "User created", newUser, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// verifying Email

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const decodedToken = await jwt.verify(token, process.env.SECRET);
    const user = await db.execute("SELECT * FROM users WHERE email = ?", [
      {
        email: decodedToken.email,
      },
    ]);

    if (user.is_verified) {
      return successResMsg(res, 200, {
        message: "user verified already",
      });
    }

    const verify = await db.execute(
      "UPDATE users SET is_verified = true WHERE is_verified = false"
    );
    return res
      .status(200)
      .json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// logging in a user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validate with joi
    await UserLogin.validateAsync(req.body);
    //  checking email and password match
    if (email && password) {
      const user = await db.execute("SELECT * FROM users WHERE email =?", [
      email,
      ]);
      if (!user) {
        return res.status(400).json({
          message: "email address not found.",
        });
      }
      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        return res.status(400).json({ message: "incorrect details" });
      }
      if (!user.is_verified) {
        return res.status(400).json({
          message: "Unverified account.",
        });
      }
    }
    // creating a payload
    const payload = {
      id: email.id,
      email: email.email,
      role: email.role,
    };

    const token = await jwt.sign(payload, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "User logged in sucessfully",
      token,
    });
  } catch (error) {
    return res.status(500).json,({ message: error.message });
  }
};


const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.query(
      `SELECT * FROM users `
    );
    if (
  !users
    ) {
      return res.status(404).json({
        message: "Users not found",
      });
    }
   
    return res.status(200).json({
      message: "Users fetch successfully",
     users
  
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getAUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.query("SELECT * FROM users WHERE id =?", [id]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Users fetch successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default { createUser, verifyEmail, login, getAllUsers, getAUser };
