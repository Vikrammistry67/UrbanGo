import _config from "../config/config.js";
import jwt from "jsonwebtoken";

const authenticationMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        const decoded = jwt.verify(token, _config.JWT_TOKEN);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }
};

export default authenticationMiddleware;