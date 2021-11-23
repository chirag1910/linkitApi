const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const {
    addBill,
    deleteBill,
    deleteBills,
    updateBill,
    getBill,
    getBills,
} = require("../Controllers/billControllers");

router.post("/add", auth, addBill);
router.post("/delete", auth, deleteBill);
router.post("/deleteAll", auth, deleteBills);
router.post("/update", auth, updateBill);
router.post("/get", auth, getBill);
router.post("/getAll", auth, getBills);

module.exports = router;
