const User = require("../Models/userModel");
const mailFeedback = require("../Utils/mailFeedback");

const sendFeedback = async (req, res) => {
    const { userID, feedback } = req.body;

    if (!feedback || typeof feedback !== "string") {
        return res.json({ status: "error", error: "Invalid feedback" });
    }

    try {
        const user = await User.findById(userID);
        if (user) {
            mailFeedback(user.email, feedback);

            return res.json({
                status: "ok",
                message: "Feedback sent successfully",
            });
        } else {
            return res.json({
                status: "error",
                error: "User not found",
            });
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Some error occurred",
        });
    }
};

const health = (req, res) => {
    return res.json({
        status: "ok",
        code: 200,
        message: "Server running",
    });
};

module.exports = {
    sendFeedback,
    health,
};
