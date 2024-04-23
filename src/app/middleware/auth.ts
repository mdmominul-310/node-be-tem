import { Request, Response, NextFunction } from 'express';
import ApiError from '../../errors/ApiError';
import JWTOperation from '../../util/jwtOperation';
import config from '../../config';


const auth = (...rules: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('x-auth-token') || req.cookies?.accessToken;
        if (!token) {
            throw new ApiError(401, 'Access Denied. No token provided');
        }
        const jwt = new JWTOperation(config.jwt_secret as string, config.jwt_expire_in as string);
        const decoded = jwt.verifyToken(token) as { role: string, userId: string }; // Specify the type for decoded
        if (!decoded) {
            throw new ApiError(401, 'Invalid token');
        }
        // console.log(decoded, rules);
        if (!rules.includes(decoded.role)) {
            throw new ApiError(403, 'Forbidden Access');
        }

        req.user = decoded;

        next();
    }
    catch (error) {
        next(error);
    }
}

export default auth;