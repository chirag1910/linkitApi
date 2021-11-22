const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        bills: [
            {
                amount: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                },
                description: {
                    type: String,
                },
                date: {
                    type: Date,
                },
            },
        ],
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
