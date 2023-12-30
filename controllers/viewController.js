const path = require("path");


exports.renderIndex = (req, res) => {
    res.render("index");
};

exports.renderViewDetails = (req, res) => {
    res.render("viewDetails");
};

exports.renderLogin = (req, res) => {
    res.render("login");
};

exports.renderSignup = (req, res) => {
    res.render("signup");
};

exports.renderVerifyOtp = (req, res) => {
    res.render("verifyOtp");
};

exports.renderLogin = (req, res) => {
    res.render("login");
};

exports.renderForgot = (req, res) => {
    res.render("forgot-password");
};

exports.renderResetPassword = (req, res) => {
    const { token } = req.query;
  res.render('reset-password', { token });
};