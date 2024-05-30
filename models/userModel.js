const e = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        identity_num: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [
                /^[0-9]{9,12}$/,
                "Vui lòng nhập số chứng minh nhân dân hoặc số căn cước hợp lệ",
            ],
        },
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên"],
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            trim: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Vui lòng nhập email hợp lệ"],
        },
        password: {
            type: String,
            required: [true, "Vui lòng nhập mật khẩu"],
            minLength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
        },
        dateOfBirth: {
            type: Date,
            required: false,
            default: new Date("2000-01-01"),
        },
        gender: {
            type: String,
            required: true,
            enum: ["Nam", "Nữ"],
        },
        role: {
            type: String,
            required: [true],
            default: "user",
            enum: ["user", "admin"],
        },
        photo: {
            type: String,
            required: false,
            default:
                "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
        },
        phone: {
            type: String,
            required: false,
            default: "+84 123 456 7890",
        },
        position: {
            type: String,
            required: false,
            default: "Nhân viên",
        },
    },
    { timestamps: true }
);

// Encrypt password using bcrypt before saving to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next;
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
