const express = require("express");
const router = express.Router();
const { auth, admin } = require("../Middlewares/authMiddleware");

const {
    initializeUser,
    registerUser,
    loginUser,
    authGoogle,
    sendOtp,
    resetForgotPassword,
    changePassword,
    logoutUser,
    getUser,
    deleteUser,
    getAll,
} = require("../Controllers/userControllers");

router.post("/init", initializeUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/auth/google", authGoogle);
router.post("/otp", sendOtp);
router.post("/resetPassword", resetForgotPassword);
router.post("/changePassword", auth, changePassword);
router.post("/logout", auth, logoutUser);
router.post("/get", auth, getUser);
router.post("/delete", auth, deleteUser);
router.post("/getAll", admin, getAll);

module.exports = router;
