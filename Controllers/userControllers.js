const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/generateToken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    const { name, email, password: plainPassword } = req.body;

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

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const password = await bcrypt.hash(plainPassword, 7);
            const user = await User.create({ name, email, password });
            const token = generateToken(user._id);

            res.cookie("JWT_TOKEN", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: true,
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
                sameSite: true,
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

        const { name, email } = ticket.getPayload();

        try {
            const user = await User.findOne({ email });
            if (!user) {
                const password = await bcrypt.hash(ticket.getUserId(), 7);
                const user = await User.create({ name, email, password });
                const token = generateToken(user._id);

                res.cookie("JWT_TOKEN", token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                    sameSite: true,
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
                    sameSite: true,
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

const logoutUser = async (req, res) => {
    res.clearCookie("JWT_TOKEN");
    return res.json({ status: "ok", message: "Logged out successfully" });
};

const getUser = async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    if (user) {
        return res.json({
            status: "ok",
            name: user.name,
            email: user.email,
        });
    } else {
        return res.json({ status: "error", error: "User not found" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.body;
    const user = await User.findById(id);

    if (user) {
        await user.remove();
        return res.json({
            status: "ok",
            message: "Account deleted successfully",
        });
    } else {
        return res.json({ status: "error", error: "User not found" });
    }
};

const getAll = async (req, res) => {
    const users = await User.find({});
    return res.json({ status: "ok", response: users });
};

module.exports = {
    registerUser,
    loginUser,
    authGoogle,
    logoutUser,
    getUser,
    deleteUser,
    getAll,
};
