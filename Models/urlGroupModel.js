const mongoose = require("mongoose");

const urlGroupSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    groupID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    public: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("UrlGroup", urlGroupSchema);
