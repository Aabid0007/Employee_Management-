const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter,sendOTP } = require("../config/emailConfig");



function generateOTP() {
 const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6_digit_OTP
  const otpExpiration = Date.now() + 2 * 60 * 1000; // 2 minutes 

  return { otp, otpExpiration };
}


// Register_a_user
const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Check if the user already exists in the database
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.render('signup',{ alreadyExists:"User already exists. Please choose a different email."});
  } else {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate_otp
    const { otp, otpExpiration } = generateOTP();

    // Save_otp_and_session
    req.session.signupData = { username, email, password: hashedPassword, generatedOTP: otp, otpExpiration };
   
    // Send_otp_to_the_user
    sendOTP(email, otp);

    return res.redirect("/verify-otp");
  }
});


// otp_verify
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!req.session.signupData) {
    return res.render("verifyOtp", { error: "Signup data not found. Please try again." });
  }
  const { username, email, password, generatedOTP, otpExpiration } = req.session.signupData;

 
  if (Date.now() > otpExpiration) {
  
    delete req.session.signupData;
    return res.render('verifyOtp',{otpMismatch:"OTP has expired. Please request a new one."});
  }

  if (otp === generatedOTP) {
    // User verified, now create the user in the database
    const userdata = await User.create({
      username,
      email,
      password,
    });

    delete req.session.signupData;

    console.log(userdata);
    return res.redirect("/login");
  } else {
    return res.render('verifyOtp',{error:"Incorrect OTP. Please try again."});
  }
});



//login_user

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (isPasswordMatch) {
//       req.session.isAuth = true;

//       return res.redirect("/");
//     }else{
//       res.send("wrong password");
//     }

   
//   } catch (error) {
//     console.error(error);
//     return res.send("Error during login ");
//   }
// });
// ... (other imports)

// Separate function to send OTP email

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).render('login',{ emailNotFound: "User not found"});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {

      req.session.isAuth = true;
       return res.redirect("/"); 
    } else {
      return res.status(404).render('login',{ wrongPassword: "Wrong password"});
    }
  } catch (error) {
    console.error(error);
    return res.send("Error during login");
  }
});



//logout  
const logout = asyncHandler(async (req, res) => {
  console.log("Before destroying session:", req.sessionID);
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("After destroying session:", req.sessionID);
      res.clearCookie("connect.sid");
      res.redirect("/login");
    }
  });
});


// forgot_password


const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).render('forgot-password', { errorMessage: 'User not found' });
      
    }
    // Generate_a_unique_JWT_token_for_password_reset
    const tokenExpirationTime = 7 * 60 * 1000; // 7 minutes 
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: `${tokenExpirationTime}ms` });

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + tokenExpirationTime;
    await user.save();

    const resetLink = `https://employee-management-38fu.onrender.com/reset-password?token=${token}`;
    console.log(resetLink);
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      
    });
    res.status(200).render('forgot-password', { successMessage: 'Password reset email sent successfully'  });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// reset_password
 const ResetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).render('reset-password', {passwordMismatchMessage: 'New password and confirm password do not match', token});
      
    }
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
   
    if (!user) {
      return res.status(404).render('reset-password',{ tokenExpiredMessage: 'Invalid or expired token' ,token});
    }

    // Update_the_user_password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear_the_reset_token_and_expiration_time
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    res.status(200).render('reset-password', {successMessage: 'Password reset successfully',token});
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Password reset token has expired' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

 
  module.exports = {
    signupUser,
    loginUser,
    logout,
    forgotPassword,
    ResetPassword,
    verifyOTP,
  };
  