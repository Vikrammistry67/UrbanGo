import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { registerUserValidation } from '../validations/auth.validator.js';

router.post(
    '/register',
    registerUserValidation,
    authController.registerUser
);


router.post(
    '/login',
    authController.loginUser
);

router.post(
    '/logout',
    authenticationMiddleware,
    authController.logoutUser
);

router.get(
    '/me',
    authenticationMiddleware,
    authController.getUserMe
);


router.get('/me/:id', authenticationMiddleware, authController.getUserById)

router.put(
    "/update",
    authenticationMiddleware,
    authController.updateUser
);

router.delete(
    "/delete",
    authenticationMiddleware,
    authController.deleteUser
);




export default router;