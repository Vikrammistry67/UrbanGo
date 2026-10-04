import express from "express";

import captainController from "../controllers/captain.controller.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import authorizeMiddleware from "../middlewares/authorization.middleware.js";

const router = express.Router();

// Public
router.post("/register", captainController.registerCaptain);
router.post("/login", captainController.loginCaptain);

// Protected
router.post(
    "/logout",
    authenticationMiddleware,
    authorizeMiddleware("captain"),
    captainController.logoutCaptain
);

router.get(
    "/me",
    authenticationMiddleware,
    authorizeMiddleware("captain"),
    captainController.getCaptainProfile
);

export default router;