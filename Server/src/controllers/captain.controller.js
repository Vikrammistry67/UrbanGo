import CaptainModel from "../models/captain.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _config from "../config/config.js";


const registerCaptain = async (req, res) => {
    try {
        const { fullName, email, password, vehicle } = req.body;
        const { firstName, lastName } = fullName;
        const { color, numberPlate, vehicleType, capacity } = vehicle;

        const isCaptainAlreadyExist = await CaptainModel.findOne({ email });
        if (isCaptainAlreadyExist) {
            return res.status(409).json({
                status: false,
                message: 'Captain Already exists'
            });
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const captain = await CaptainModel.create({
            fullName: { firstName, lastName },
            email,
            vehicle: { color, numberPlate, vehicleType, capacity },
            password: hashPassword
        });

        const token = jwt.sign({
            id: captain._id
        }, _config.JWT_TOKEN, {
            expiresIn: '3d'
        });

        res.cookies('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        return res.status(201).json({
            success: true,
            message: 'Captain registered successfully',
            data: {
                id: captain._id,
                fullName: captain.fullName,
                email: captain.email,
                vehicle: captain.vehicle
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const loginCaptain = async (req, res) => {
    try {

        const { email, password } = req.body;

        const captain = await CaptainModel.findOne({ email });

        if (captain.email != email) {
            return res.status(404).json({
                success: false,
                message: 'Wrong email or password'
            });
        };

        const isValidPassword = await bcrypt.compare(captain.password, password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'wrong email or password'
            });
        };


        const token = jwt.sign({
            id: captain._id
        }, _config.JWT_TOKEN,
            {
                expiresIn: '3d'
            });

        res.cookies('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days

        });


        return res.status(200).json({
            success: true,
            message: 'Captain LoggedIn Successfully',
            email
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const logoutCaptain = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const updateCaptain = async (req, res) => {
    try {
        const { fullName, email, password, vehicle } = req.body;

        const captain = await CaptainModel.findById(req.user.id).select("+password");

        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found",
            });
        }

        // Full name
        if (fullName) {
            if (fullName.firstName !== undefined) {
                captain.fullName.firstName = fullName.firstName;
            }

            if (fullName.lastName !== undefined) {
                captain.fullName.lastName = fullName.lastName;
            }
        }

        // Email
        if (email !== undefined) {
            captain.email = email;
        }

        // Password
        if (password) {
            captain.password = await bcrypt.hash(password, 12);
        }

        // Vehicle
        if (vehicle) {
            if (vehicle.color !== undefined) {
                captain.vehicle.color = vehicle.color;
            }

            if (vehicle.numberPlate !== undefined) {
                captain.vehicle.numberPlate = vehicle.numberPlate;
            }

            if (vehicle.vehicleType !== undefined) {
                captain.vehicle.vehicleType = vehicle.vehicleType;
            }

            if (vehicle.capacity !== undefined) {
                captain.vehicle.capacity = vehicle.capacity;
            }
        }

        const updatedCaptain = await captain.save();

        const captainData = updatedCaptain.toObject();
        delete captainData.password;

        return res.status(200).json({
            success: true,
            message: "Captain updated successfully",
            captainData,
        });
    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email or number plate already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const getCaptainProfile = async (req, res) => {
    try {
        const captain = await CaptainModel.findById(req.user.id);

        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Captain profile fetched successfully",
            captainProfile: captain,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const deleteCaptain = async (req, res) => {
    try {
        const captain = await CaptainModel.findByIdAndDelete(req.user.id);

        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found"
            });
        }

        res.clearCookie("accessToken");

        return res.status(200).json({
            success: true,
            message: "Captain deleted successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getCaptainById = async (req, res) => {
    try {
        const { id } = req.params;

        const captain = await CaptainModel.findById(id);

        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Captain fetched successfully",
            captain
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};






export default {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    updateCaptain,
    deleteCaptain,
    getCaptainById,
    getCaptainProfile
};
