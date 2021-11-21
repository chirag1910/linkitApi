const mongoose = require("mongoose");
const Bill = require("./billModel").schema;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        bills: [Bill],
        otp: {
            type: Number,
        },
        otpExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
