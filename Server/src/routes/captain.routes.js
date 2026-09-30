import express from "express";

import {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile,
    updateCaptain,
    updateCaptainLocation,
    updateCaptainStatus,
    updateCaptainVehicle,
} from "../controllers/captain.controller.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();

// Public
router.post("/register", registerCaptain);
router.post("/login", loginCaptain);

// Protected
router.use(authenticationMiddleware);

router.post("/logout", logoutCaptain);

router.get("/profile", getCaptainProfile);

router.patch("/profile", updateCaptain);

// router.delete("/profile", deleteCaptain);-

router.patch("/location", updateCaptainLocation);

router.patch("/status", updateCaptainStatus);

router.patch("/vehicle", updateCaptainVehicle);

export default router;