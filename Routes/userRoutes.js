const express = require("express");
const router = express.Router();
const { auth, admin } = require("../Middlewares/authMiddleware");

const {
    registerUser,
    loginUser,
    authGoogle,
    logoutUser,
    getUser,
    deleteUser,
    getAll,
} = require("../Controllers/userControllers");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/auth/google", authGoogle);
router.get("/logout", auth, logoutUser);
router.get("/", auth, getUser);
router.delete("/delete", auth, deleteUser);
router.post("/", admin, getAll);

module.exports = router;
