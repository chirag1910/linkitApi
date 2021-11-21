const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Bill", billSchema);
