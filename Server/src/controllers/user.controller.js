import _config from "../config/config.js";
import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import brcrypt from 'bcrypt';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await brcrypt.hash(password, 10);

        const userData = await UserModel.create({
            username,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            {
                id: userData._id,
                email: userData.email
            },
            _config.JWT_TOKEN,
            {
                expiresIn: "3d"
            }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            userData
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Wrong email or password"
            });
        }

        const isValidPassword = await brcrypt.compare(
            password,
            user.password
        );

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Wrong email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            _config.JWT_TOKEN,
            { expiresIn: "3d" }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const getUserMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            user.password = await brcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(
            req.user.id
        );

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User account deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};






export default {
    registerUser,
    loginUser,
    getUserMe,
    logoutUser,
    updateUser,
    deleteUser,
};