const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    groupID: {
        type: String,
        required: true,
    },
    urlID: {
        type: String,
        required: true,
    },
    fullUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    visits: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Url", urlSchema);
