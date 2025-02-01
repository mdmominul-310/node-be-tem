import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";
import JWTOperation from "../../../util/jwtOperation";
import encryptionOperation from "../../../util/encryptionOperation";
import config from "../../../config";
import { IPaginatinQuery } from "../../../interfaces/common";
import { IResponseType } from "../../../helpers/responseReturn";
import ServiceModel from "../../../helpers/serviceModel";
import { JwtPayload } from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";

class UserService extends ServiceModel {
  user: typeof User;
  jwt: JWTOperation;
  constructor(user: typeof User) {
    super();
    this.user = user;
    this.jwt = new JWTOperation(
      config?.jwt_secret as string,
      config?.jwt_expire_in as string
    );
  }

  async create(payload: IUser, token?: string): Promise<IUser> {
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Your Otp is Expired");
    }

    const isExist = await User.findOne({
      $or: [{ email: payload?.email }, { phone: payload?.phone }],
    });
    // check if user already exist or not
    if (isExist) {
      throw new ApiError(httpStatus.CONFLICT, "User Already Exist");
    }
    // check token available or not
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to Verify OTP");
    }

    const decodedToken: string | JwtPayload = this.jwt.verifyToken(
      token
    ) as JwtPayload;
    // check if token is valid or not
    if (!decodedToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to Verify OTP");
    }
    const { email, phoneNumber, provider, otp } = decodedToken;
    // check if email or phone number is same or not
    if (provider === "email") {
      payload.emailVerified = true;
      if (email !== payload?.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Email");
      }
    }

    if (provider === "phone") {
      payload.phoneNumberVerified = true;

      if (phoneNumber !== payload?.phone) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Phone Number");
      }
    }
    // check if otp is same or not
    if (otp !== parseInt(payload?.otp as string)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Wrong OTP");
    }

    payload.password = await encryptionOperation.hashPassword(
      payload?.password as string
    );
    // create user
    const result = await User.create(payload);
    result.password = undefined;
    return result;
  }

  async getAllUser(
    pagination: IPaginatinQuery
  ): Promise<IResponseType<IUser[]>> {
    const { limit, page, filter } = pagination;
    const skip = limit * (page - 1);
    const query: Record<string, unknown> = {};
    if (filter?.role) {
      query.$and = [{ role: filter.role }];
    }
    const users = await this.user.find(query).limit(limit).skip(skip);

    return {
      meta: {
        limit,
        page,
        total: await this.user.countDocuments(query),
      },
      data: users,
    };
  }

  async delete(id: string) {
    return this.user.findByIdAndDelete(id);
  }

  async update(
    payload: IUser,
    id: string,
    token?: string
  ): Promise<IUser | null> {
    // console.log("payload", token);
    const isExistUser = await this.user.findById(id).select("+password");
    if (!isExistUser) {
      throw new ApiError(httpStatus.CONFLICT, "User not Exists");
    }
    if (payload?.role) {
      throw new ApiError(httpStatus.CONFLICT, "You can not change role");
    }
    // console.log("payload", payload);
    if (payload?.password && payload?.oldPassword) {
      // const matchedPass = await User.isPasswordMatched(payload?.oldPassword as string, isExistUser?.password)
      const matchedPass = await encryptionOperation.comparePassword(
        payload?.oldPassword as string,
        isExistUser?.password as string
      );
      if (!matchedPass) {
        throw new ApiError(httpStatus.CONFLICT, "Old Password not match");
      }
      isExistUser.password = payload?.password;
    }

    // if user want to change email or phone number then user must have verify otp frist
    if (
      (payload?.email || payload?.phone) &&
      ((payload.email && payload?.email !== isExistUser.email) ||
        (payload.phone && payload?.phone !== isExistUser.phone))
    ) {
      // console.log("payload", payload.email, payload.phone, isExistUser.email, isExistUser.phone,)
      if (!token) {
        throw new ApiError(httpStatus.CONFLICT, "Failed to verify user!");
      }
      // const decodedToken = jwtHelpers.verifyToken(token, config?.jwt_secret as string);
      const decodedToken: string | JwtPayload = this.jwt.verifyToken(
        token
      ) as JwtPayload;
      if (!decodedToken) {
        throw new ApiError(httpStatus.CONFLICT, "Failed to verify user!");
      }
      const { email, phoneNumber, provider, otp } = decodedToken;

      // check if email or phone number is same or not
      if (provider === "email") {
        const isEmailUsed = await this.user.findOne({ email: payload?.email });
        if (isEmailUsed) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Used");
        }
        if (email !== payload?.email) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Email");
        }
        // check if otp is same or not

        if (otp !== parseInt(payload?.otp as string)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Wrong OTP");
        }
        isExistUser.email = email;
        isExistUser.emailVerified = true;
      }

      if (provider === "phone") {
        const isPhoneUsed = await this.user.findOne({ phone: payload?.phone });
        if (isPhoneUsed) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Phone Number Already Used"
          );
        }
        if (phoneNumber !== payload?.phone) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Phone Number");
        }
        // check if otp is same or not

        if (otp !== parseInt(payload?.otp as string)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Wrong OTP");
        }
        isExistUser.phone = phoneNumber;
        isExistUser.phoneNumberVerified = true;
      }
    }

    if (payload?.name) {
      isExistUser.name = payload?.name;
    }
    if (payload.profileImage) {
      isExistUser.profileImage = payload.profileImage;
    }
    if (payload?.dob) {
      isExistUser.dob = payload.dob;
    }
    if (payload.firstName) {
      isExistUser.firstName = payload.firstName;
    }
    if (payload.lastName) {
      isExistUser.lastName = payload.lastName;
    }
    if (payload.gender) {
      isExistUser.gender = payload.gender;
    }

    return await isExistUser.save();
  }

  async getUser(id: string): Promise<IUser | null> {
    return this.user.findById(id);
  }
}

const userService = new UserService(User);
export default userService;
