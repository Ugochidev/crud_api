const allUsers = "SELECT id, first_name, last_name, phone_number, email FROM users";
const checkEmail = "SELECT email FROM users WHERE email = ?";
const newUser =
  "INSERT INTO users ( id, first_name, last_name, email, phone_number, password) VALUES ( ?, ?, ?, ?, ?, ?)";
const verifyMail = "SELECT is_verified FROM users WHERE email = ?";
const updateVerified = "UPDATE users SET is_verified = true WHERE email = ?";
const loginUser = "SELECT id, email, password, is_verified FROM users WHERE email =?";
const getUser =
  "SELECT id, first_name, last_name, phone_number FROM users WHERE id = ?";
const findUser =
  "SELECT id, first_name, last_name, phone_number, password FROM users WHERE id =?";
const removeUser = "DELETE FROM users WHERE id = ?";
export {
  allUsers,
  checkEmail,
  newUser,
  verifyMail,
  updateVerified,
  loginUser,
  getUser,
  findUser,
  removeUser,
};
