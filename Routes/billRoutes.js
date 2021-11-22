const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const { addBill, deleteBill } = require("../Controllers/billControllers");

router.post("/add", auth, addBill);
router.post("/delete", auth, deleteBill);

module.exports = router;
