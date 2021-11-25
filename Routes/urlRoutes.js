const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/authMiddleware");

const {
    addUrl,
    deleteUrl,
    deleteUrls,
    updateUrl,
    getUrl,
    getUrls,
    getTotalUrlsCount,
    getTotalUrlsVisits,
    publicGetUrl,
} = require("../Controllers/urlControllers");

router.post("/add", auth, addUrl);
router.post("/delete", auth, deleteUrl);
router.post("/deleteAll", auth, deleteUrls);
router.post("/update", auth, updateUrl);
router.post("/get", auth, getUrl);
router.post("/getAll", auth, getUrls);
router.post("/TotalCount", auth, getTotalUrlsCount);
router.post("/TotalVisits", auth, getTotalUrlsVisits);
router.post("/public/get", publicGetUrl);

module.exports = router;
