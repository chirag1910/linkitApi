const User = require("../Models/userModel");
const UrlGroup = require("../Models/urlGroupModel");
const Url = require("../Models/urlModel");
const OTP = require("../Models/otpModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/generateToken");
const generateOTP = require("../Utils/generateOtp");
const mailOtp = require("../Utils/mailOtp");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const initializeUser = async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
        return res.json({ status: "error", error: "Invalid email" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const otp = generateOTP();
            const otpExpire = new Date(new Date().getTime() + 30 * 60 * 1000);

            mailOtp(email, otp);

            const entry = await OTP.findOne({ email });

            if (entry) {
                await entry.updateOne({ otp, otpExpire });
            } else {
                await OTP.create({ email, otp, otpExpire });
            }

            return res.json({
                status: "ok",
                message: "OTP sent successfully",
            });
        } else {
            return res.json({
                status: "error",
                error: "Email already exists",
            });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password: plainPassword, otp } = req.body;

    if (!name || typeof name !== "string") {
        return res.json({ status: "error", error: "Invalid name" });
    }
    if (!email || typeof email !== "string") {
        return res.json({ status: "error", error: "Invalid email" });
    }
    if (!plainPassword || typeof plainPassword !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }
    if (plainPassword.length < 8) {
        return res.json({
            status: "error",
            error: "Minimum password length must be 8 characters",
        });
    }
    if (!otp) {
        return res.json({ status: "error", error: "Invalid OTP" });
    }

    try {
        const user = await User.findOne({ email });
        const entry = await OTP.findOne({ email });

        if (!user) {
            if (entry) {
                if (entry.otp == otp) {
                    if (entry.otpExpire >= new Date()) {
                        const password = await bcrypt.hash(plainPassword, 7);

                        const user = await User.create({
                            name,
                            email,
                            password,
                        });

                        await entry.remove();

                        const token = generateToken(user._id);

                        res.cookie("JWT_TOKEN", token, {
                            maxAge: 7 * 24 * 60 * 60 * 1000,
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        });

                        return res.json({
                            status: "ok",
                            name: user.name,
                            email: user.email,
                            token,
                        });
                    } else {
                        return res.json({
                            status: "error",
                            error: "OTP expired",
                        });
                    }
                } else {
                    return res.json({ status: "error", error: "Invalid OTP" });
                }
            } else {
                return res.json({
                    status: "error",
                    error: "Please request OTP again",
                });
            }
        } else {
            return res.json({
                status: "error",
                error: "Email already exists",
            });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
        return res.json({ status: "error", error: "Invalid email" });
    }
    if (!password || typeof password !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);

            res.cookie("JWT_TOKEN", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });

            return res.json({
                status: "ok",
                name: user.name,
                email: user.email,
                token,
            });
        } else {
            return res.json({
                status: "error",
                error: "Invalid email or password",
            });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const authGoogle = async (req, res) => {
    const { googleToken } = req.body;

    if (!googleToken) {
        return res.json({ status: "error", error: "Token not found" });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, at_hash } = ticket.getPayload();

        try {
            const user = await User.findOne({ email });
            if (!user) {
                const password = await bcrypt.hash(at_hash, 7);
                const user = await User.create({ name, email, password });
                const token = generateToken(user._id);

                res.cookie("JWT_TOKEN", token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });

                return res.json({
                    status: "ok",
                    name: user.name,
                    email: user.email,
                    token,
                });
            } else {
                const token = generateToken(user._id);

                res.cookie("JWT_TOKEN", token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });

                return res.json({
                    status: "ok",
                    name: user.name,
                    email: user.email,
                    token,
                });
            }
        } catch (error) {
            return res.json({
                status: "error",
                error: "Some error occurred",
            });
        }
    } catch (error) {
        return res.json({ status: "error", error: "Invalid token" });
    }
};

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
        return res.json({ status: "error", error: "Invalid email" });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            const otp = generateOTP();
            const otpExpire = new Date(new Date().getTime() + 30 * 60 * 1000);

            mailOtp(email, otp);
            await user.updateOne({ otp, otpExpire });

            return res.json({
                status: "ok",
                message: "OTP sent successfully",
            });
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const resetForgotPassword = async (req, res) => {
    const { email, otp, password: newPassword } = req.body;

    if (!email || typeof email !== "string") {
        return res.json({ status: "error", error: "Invalid email" });
    }
    if (!otp) {
        return res.json({ status: "error", error: "Invalid OTP" });
    }
    if (!newPassword || typeof newPassword !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }
    if (newPassword.length < 8) {
        return res.json({
            status: "error",
            error: "Minimum password length must be 8 characters",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (user) {
            if (user.otp == otp) {
                if (user.otpExpire >= new Date()) {
                    const password = await bcrypt.hash(newPassword, 7);

                    await user.updateOne({
                        password,
                        otpExpire: new Date(new Date().getTime() - 1),
                    });

                    return res.json({
                        status: "ok",
                        message: "Password changed successfully",
                    });
                } else {
                    return res.json({ status: "error", error: "OTP expired" });
                }
            } else {
                return res.json({ status: "error", error: "Invalid OTP" });
            }
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const changePassword = async (req, res) => {
    const { userID, oldPassword, newPassword } = req.body;

    if (!oldPassword || typeof oldPassword !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }
    if (!newPassword || typeof newPassword !== "string") {
        return res.json({ status: "error", error: "Invalid new password" });
    }
    if (newPassword.length < 8) {
        return res.json({
            status: "error",
            error: "Minimum password length must be 8 characters",
        });
    }

    try {
        const user = await User.findById(userID);

        if (user) {
            if (await bcrypt.compare(oldPassword, user.password)) {
                const password = await bcrypt.hash(newPassword, 7);

                await user.updateOne({
                    password,
                });

                return res.json({
                    status: "ok",
                    message: "Password changed successfully",
                });
            } else {
                return res.json({
                    status: "error",
                    error: "Incorrect password",
                });
            }
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const changeName = async (req, res) => {
    const { userID, name } = req.body;

    if (!name || typeof name !== "string") {
        return res.json({ status: "error", error: "Invalid name" });
    }

    try {
        const user = await User.findById(userID);

        if (user) {
            await user.updateOne({
                name,
            });

            return res.json({
                status: "ok",
                message: "Name changed successfully",
            });
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("JWT_TOKEN");
    return res.json({ status: "ok", message: "Logged out successfully" });
};

const getUser = async (req, res) => {
    const { userID } = req.body;
    try {
        const user = await User.findById(userID);

        if (user) {
            return res.json({
                status: "ok",
                name: user.name,
                email: user.email,
            });
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const deleteUser = async (req, res) => {
    const { userID, password } = req.body;

    if (!password || typeof password !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
    }

    try {
        const user = await User.findById(userID);

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const urlGroups = await UrlGroup.find({ userID });

                urlGroups.forEach(async (urlGroup) => {
                    const urls = await Url.find({
                        userID,
                        groupID: urlGroup.groupID,
                    });

                    urls.forEach(async (url) => {
                        await url.remove();
                    });

                    await urlGroup.remove();
                });

                await user.remove();

                return res.json({
                    status: "ok",
                    message: "Account deleted successfully",
                });
            } else {
                return res.json({
                    status: "error",
                    error: "Incorrect password",
                });
            }
        } else {
            return res.json({ status: "error", error: "User not found" });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const getAll = async (req, res) => {
    const users = await User.find({});
    return res.json({ status: "ok", response: users });
};

module.exports = {
    initializeUser,
    registerUser,
    loginUser,
    authGoogle,
    sendOtp,
    resetForgotPassword,
    changePassword,
    changeName,
    logoutUser,
    getUser,
    deleteUser,
    getAll,
};
