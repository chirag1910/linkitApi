const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
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
        required: true,
    },
});

module.exports = mongoose.model("Bill", billSchema);
