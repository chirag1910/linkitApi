const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const {
    addBill,
    deleteBill,
    updateBill,
    getBill,
} = require("../Controllers/billControllers");

router.post("/add", auth, addBill);
router.post("/delete", auth, deleteBill);
router.post("/update", auth, updateBill);
router.post("/get", auth, getBill);

module.exports = router;
