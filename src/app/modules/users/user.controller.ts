import httpStatus from "http-status";
import { Request, Response } from "express";
import ApiError from "../../../errors/ApiError";
import catchAsync from "../../../helpers/catchAsync";
import User from "./user.model";
import userService from "./user.service";
import authService from "../auth/auth.service";
import responseReturn from "../../../helpers/responseReturn";
import config from "../../../config";
import smsEmailTransporter from "../../../helpers/smsEmailTransporter";
import signUpSuccessEmailTemplate from "../../../helpers/emailTemplate/signUpSuccessEmailTemplate";
import JWTOperation from "../../../util/jwtOperation";
import { IUser } from "./user.interface";

class UserController {
  userService: typeof userService;
  transporter: typeof smsEmailTransporter;
  jwt: JWTOperation;
  constructor() {
    this.userService = userService;
    this.transporter = smsEmailTransporter;
    this.jwt = new JWTOperation(
      config?.jwt_secret as string,
      config?.jwt_expire_in as string
    );
  }

  sendOtpUserVerify = catchAsync(async (req: Request, res: Response) => {
    const { phoneNumber, email, provider } = req.body;

    const isUserExist = await User.findOne({
      $or: [
        { phone: phoneNumber ? phoneNumber : "" },
        { email: email ? email : "" },
      ],
    });
    if (isUserExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Already Exist");
    }

    if (!phoneNumber && !email) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please Provide Email or Phone Number"
      );
    }
    if (provider === "phone") {
      if (!phoneNumber) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please Provide Phone Number"
        );
      }
      const isExist = await User.findOne({
        phone: phoneNumber.includes("+88") ? phoneNumber : "+88" + phoneNumber,
      });
      if (isExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Phone Number Already Exist"
        );
      }
    }

    if (provider === "email") {
      const isExist = await User.findOne({ email: email });
      if (isExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Exist");
      }
    }

    // const result = await authServices.verifyPhoneOrEmailService(req.body);
    const result = await authService.verifyEmailOrPhone(req.body);
    if (result?.status !== 200) {
      throw new ApiError(httpStatus.CONFLICT, "Failed To send OTP");
    }
    if (result?.status === 200) {
      res.cookie("otv", result.token, {
        expires: new Date(Date.now() + 1000 * 5 * 60),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    }

    responseReturn(res, {
      success: true,
      message: "Otp Send Successfully",
      data: `Your Otp will expire in ${new Date(
        Date.now() + 1000 * 5 * 60
      ).toLocaleString()}`,
    });
  });

  createUser = catchAsync(async (req: Request, res: Response) => {
    // const result = await authService.createUser(req.body, req.cookies?.otv);
    const result = await this.userService.create(req.body, req.cookies?.otv);
    if (result) {
      await this.transporter.sendEmail({
        to: result.email,
        subject: "Success",
        message: signUpSuccessEmailTemplate(result?.name as string),
      });
    }

    const accessToken = this.jwt.createToken({
      userId: result._id,
      role: result.role,
    });
    const refreshToken = this.jwt.createToken({
      userId: result._id,
      role: result.role,
    });

    const responseResult = {
      accessToken,
      userInfo: result,
    };

    res.cookie("accessToken", accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 30),
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "none",
    });
    responseReturn(res, {
      success: true,
      message: "User Created Successfully",
      data: responseResult,
    });
  });
  updateUser = catchAsync(async (req: Request, res: Response) => {
    const { ...restData } = req.body;
    const token = req?.cookies?.otv;
    const UserId: string = req?.user?.userId as string;
    const result = await this.userService.update(restData, UserId, token);
    responseReturn<IUser>(res, {
      message: "User updated successfully",
      data: result,
      success: true,
    });
  });
  getAllUser = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, ...restData } = req.query;
    const pagination = {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      filter: restData,
    };
    const result = await this.userService.getAllUser(pagination);
    responseReturn(res, {
      success: true,
      message: "User List",
      data: result,
    });
  });
}

const userController = new UserController();

export default userController;
