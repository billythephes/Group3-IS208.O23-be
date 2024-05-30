const express = require("express");
const router = express.Router();
const {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    getUsers,
    getLoginStatus,
    updateUser,
    updatePhoto,
    deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/create", protect, adminOnly, createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/getUsers", protect, adminOnly, getUsers);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, adminOnly, updateUser);
router.delete("/deleteUser/:id", protect, adminOnly, deleteUser);
router.patch("/updatePhoto", protect, updatePhoto);

module.exports = router;
