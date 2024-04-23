import { Request, Response, NextFunction } from "express";
import config from "../../config";
import ApiError from "../../errors/ApiError";

const authApiKeys = (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.header('x-api-key');
        if (!apiKey) {
            throw new ApiError(401, 'Access Denied. No token provided');
        }
        if (apiKey !== config.auth_api_key) {
            throw new ApiError(403, 'Forbidden Access');
        }
    } catch (error) {
        next(error);
    }
    next();
}

export default authApiKeys;
