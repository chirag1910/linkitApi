const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const { sendFeedback } = require("../Controllers/miscControllers");

router.post("/sendFeedback", auth, sendFeedback);

module.exports = router;
