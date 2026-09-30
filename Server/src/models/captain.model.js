import mongoose from "mongoose";

const captainSchema = new mongoose.Schema(
    {
        fullName: {
            firstName: {
                type: String,
                required: true,
                trim: true,
            },
            lastName: {
                type: String,
                required: true,
                trim: true,
            },
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        socketId: {
            type: String,
            default: null,
        },

        vehicle: {
            color: {
                type: String,
                required: true,
                trim: true,
            },

            numberPlate: {
                type: String,
                required: true,
                unique: true,
                uppercase: true,
                trim: true,
            },

            vehicleType: {
                type: String,
                required: true,
                enum: ["bike", "auto", "car"],
                default: "car",
            },

            capacity: {
                type: Number,
                required: true,
                default: 4,
                min: 1,
                max: 8,
            },
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },

        location: {
            lat: {
                type: Number,
                min: -90,
                max: 90,
            },

            lng: {
                type: Number,
                min: -180,
                max: 180,
            },
        },
    },
    {
        timestamps: true,
    }
);

const CaptainModel = mongoose.model("Captain", captainSchema);

export default CaptainModel;