const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// Register user
const createUser = asyncHandler(async (req, res) => {
    const { identity_num, name, email, password, dateOfBirth, gender, photo, phone} = req.body;

    if (!name || !email || !password || !identity_num || !dateOfBirth || !gender) {
        res.status(400);
        throw new Error("Vui lòng điền đầy đủ thông tin");
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("Mật khẩu phải có ít nhất 6 ký tự!");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("Email đã được sử dụng!");
    }

    // Create new user
    const user = await User.create({
        identity_num,
        name,
        email,
        password,
        dateOfBirth,
        gender,
        photo,
        phone,
    });

    if (user) {
        const { _id, name, email, role } = user;

        res.status(201).json({
            _id,
            name,
            email,
            role,
        });
    } else {
        res.status(400);
        throw new Error("Dữ liệu không hợp lệ!");
    }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Validate email and password
    if (!email || !password) {
        res.status(400);
        throw new Error("Vui lòng điền đầy đủ thông tin!");
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("Email hoặc mật khẩu không đúng!");
    }

    // User exists, check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Generate token
    const token = generateToken(user._id);

    if (user && passwordMatch) {
        const newUser = await User.findOne({ email }).select("-password");

        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            // secure: true,
            // sameSite: "none",
        });

        // Send user data
        res.status(200).json(newUser);
    } else {
        res.status(400);
        throw new Error("Email hoặc mật khẩu không đúng!");
    }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Đăng xuất thành công!" });
});

// Get users
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("Không tìm thấy người dùng");
    }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
});

// Get login status
const getLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.json(false);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
        res.json(true);
    } else {
        res.json(false);
    }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { name, phone, dateOfBirth, gender, photo } = user;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.dateOfBirth = req.body.dateOfBirth || dateOfBirth;
        user.gender = req.body.gender || gender;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("Không tìm thấy người dùng");
    }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: "Người dùng đã được xóa!" });
    } else {
        res.status(404);
        throw new Error("Không tìm thấy người dùng");
    }
});

// Update user image
const updatePhoto = asyncHandler(async (req, res) => {
    const { photo } = req.body;

    const user = await User.findById(req.user._id);
    user.photo = photo;
    const updatedUser = await user.save();

    if (updatedUser) {
        res.status(200).json(updatedUser);
    } else {
        res.status(400);
        throw new Error("Dữ liệu không hợp lệ!");
    }
});

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUsers,
    getUser,
    getLoginStatus,
    updateUser,
    deleteUser,
    updatePhoto,
};
