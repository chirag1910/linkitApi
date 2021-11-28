const { verify } = require("jsonwebtoken");
const User = require("../Models/userModel");

const auth = async (req, res, next) => {
    const token = req.cookies.JWT_TOKEN || req.body.JWT_TOKEN;

    if (token) {
        try {
            const decoded = verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                req.body["userID"] = decoded.id;
                next();
            } else {
                return res.json({ status: "error", error: "Invalid token" });
            }
        } catch (error) {
            return res.json({ status: "error", error: "Invalid token" });
        }
    } else {
        return res.json({
            status: "error",
            error: "Not authorized",
        });
    }
};

const admin = (req, res, next) => {
    const { adminKey } = req.body;
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
        next();
    } else {
        return res.json({
            status: "error",
            error: "Not authorized",
        });
    }
};

module.exports = {
    auth,
    admin,
};
