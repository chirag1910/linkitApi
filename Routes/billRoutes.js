const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const { addBill } = require("../Controllers/billControllers");

router.post("/add", auth, addBill);

module.exports = router;
