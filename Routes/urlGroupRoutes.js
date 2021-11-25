const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const {
    addUrlGroup,
    deleteUrlGroup,
    deleteUrlGroups,
    updateUrlGroup,
    getUrlGroup,
    getUrlGroups,
    publicGetUrlGroup,
} = require("../Controllers/urlGroupControllers");

router.post("/add", auth, addUrlGroup);
router.post("/delete", auth, deleteUrlGroup);
router.post("/deleteAll", auth, deleteUrlGroups);
router.post("/update", auth, updateUrlGroup);
router.post("/get", auth, getUrlGroup);
router.post("/getAll", auth, getUrlGroups);
router.post("/public/get", publicGetUrlGroup);

module.exports = router;
