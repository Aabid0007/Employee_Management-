const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logout,
  forgotPassword,
  ResetPassword,
  verifyOTP

} = require("../controllers/userController");


router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/reset-password").post(ResetPassword);
router.route("/forgot-password").post(forgotPassword);

router.route('/verify-otp').post(verifyOTP);

module.exports = router;

