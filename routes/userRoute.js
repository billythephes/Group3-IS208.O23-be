const express = require("express");
const router = express.Router();
const {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    getUserById,
    getUsers,
    getLoginStatus,
    updateUser,
    updatePhoto,
    deleteUser,
    updateUserInfo,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create", protect, adminOnly, createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/getUserByID/:id", protect, adminOnly, getUserById);
router.get("/getUsers", protect, adminOnly, getUsers);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser/:id", protect, adminOnly, updateUser);
router.patch("/update", protect, updateUserInfo);
router.delete("/deleteUser/:id", protect, adminOnly, deleteUser);
router.patch("/updatePhoto", protect, updatePhoto);

module.exports = router;
