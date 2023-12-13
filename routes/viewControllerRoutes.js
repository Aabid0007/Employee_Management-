const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const {isAuth}= require("../authentication")


router.get("/", isAuth, viewController.renderIndex);

router.get("/viewDetails", isAuth, viewController.renderViewDetails);

router.get("/signup", viewController.renderSignup);

router.get("/verify-otp", viewController.renderVerifyOtp);

router.get("/login", viewController.renderLogin);

router.get('/forgot-password', viewController.renderForgot);

router.get('/reset-password', viewController.renderResetPassword);

module.exports = router;