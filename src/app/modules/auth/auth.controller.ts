import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import authService from "./auth.service";
import responseReturn from "../../../helpers/responseReturn";
import { IUser } from "../users/user.interface";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";

class AuthController {

    private authService: typeof authService;
    private cookieOptions: { secure: boolean, httpOnly: boolean, sameSite: "none" };

    constructor() {
        this.authService = authService;
        this.cookieOptions = {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        }

    }

    login = catchAsync(async (req: Request, res: Response) => {
        const { email, phoneNumber, password } = req.body;
        const result = await this.authService.login({ email, phoneNumber, password });
        const { accessToken, refreshToken, ...restData } = result;
        res.cookie("accessToken", result.accessToken, this.cookieOptions);
        res.cookie("refreshToken", refreshToken, this.cookieOptions);
        responseReturn(res, {
            success: true,
            message: "Login Success",
            data: { ...restData, token: accessToken }
        })

    });

    verifyEmailOrPhone = catchAsync(async (req: Request, res: Response) => {
        const result = await authService.verifyEmailOrPhone(req.body);
        if (result?.status !== 200) {
            throw new ApiError(httpStatus.CONFLICT, "Failed To send OTP")
        }
        if (result?.status === 200) {
            res.cookie("otv", result.token, this.cookieOptions);
        }
        responseReturn(res, {
            success: true,
            message: "Otp Send Successfully",
            data: `Your Otp will expire in ${new Date(Date.now() + 1000 * 5 * 60).toLocaleString()}`
        })
    }
    )
    forgotPassword = catchAsync(async (req: Request, res: Response) => {
        const result = await authService.forgotPassword(req?.body, req?.cookies?.otv);
        responseReturn<IUser | null>(res, {
            success: true,
            message: "password reset successfully",
            data: result
        })
    })

    resetPassword = catchAsync(async (req: Request, res: Response) => {
        const result = await authService.resetPassword(req.body, req?.user);
        responseReturn<IUser | null>(res, {
            success: true,
            message: "password reset successfully",
            data: result
        })
    })

    tokenLogin = catchAsync(async (req: Request, res: Response) => {
        const apiKey = req.header('x-api-key');
        if (!apiKey) {
            throw new ApiError(401, 'Access Denied! No API Key Provided!');
        }
        const result = await authService.tokenLogin(apiKey);
        const { accessToken, refreshToken, ...restData } = result;
        res.cookie("accessToken", accessToken, this.cookieOptions);
        res.cookie("refreshToken", refreshToken, this.cookieOptions);
        responseReturn(res, {
            success: true,
            message: "Login Successfully",
            data: restData
        })
    })

    logOut = catchAsync(async (req: Request, res: Response) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        responseReturn(res, {
            success: true,
            message: "Logout Successfully",
            data: null
        })
    })

}

const authController = new AuthController();
export default authController;