import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import smsEmailTransporter from "../../../helpers/smsEmailTransporter";
import JWTOperation from "../../../util/jwtOperation";
import numberOperation from "../../../util/numOperation";
import { IverifyPayload } from "./auth.interface";
import config from "../../../config";
import User from "../users/user.model";
import encryptionOperation from "../../../util/encryptionOperation";
import OtpEmailTemplate from "../../../helpers/emailTemplate/otpEmailTemplate";
import { IUser } from "../users/user.interface";
import { JwtPayload } from "jsonwebtoken";

class AuthService {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwt: JWTOperation;
  encryption: typeof encryptionOperation;
  constructor(jwtSecret: string, jwtExpiresIn: string) {
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
    this.jwt = new JWTOperation(this.jwtSecret, this.jwtExpiresIn);
    this.encryption = encryptionOperation;
  }

  async verifyEmailOrPhone(payload: IverifyPayload) {
    const { phoneNumber, email, provider } = payload;
    const OTP = numberOperation.randomSixDigitNumber();
    if (provider === "email") {
      // send email
      const token = this.jwt.createToken({
        email,
        provider: "email",
        otp: OTP,
      });

      const mailData = {
        to: email,
        subject: "OTP Verification",
        message: OtpEmailTemplate(OTP),
      };

      // const result = await emailSenderHelpers.sendEmailWithNodeMailer(mailData)
      const result = await smsEmailTransporter.sendEmail(mailData);
      if (result === "failed") {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Failed To send OTP"
        );
      }

      return { status: 200, token };
    }
    if (provider === "phone") {
      // send sms
      const token = this.jwt.createToken({
        phoneNumber: phoneNumber.includes("+88")
          ? phoneNumber
          : "+88" + phoneNumber,
        provider: "phone",
        otp: OTP,
      });
      // check phon number +88 or not if +88 or 88 then remove it
      const smsNumber = phoneNumber.replace("+88", "").replace("88", "");
      const expireTime = Date.now() + 1000 * 5 * 60; // 5 min from now
      const expireDate = new Date(expireTime);
      const localExpireTime = expireDate.toLocaleString();
      const result = await smsEmailTransporter.sendSms(
        smsNumber,
        `Your Verification Code is ${OTP} ! your otp will expire ${localExpireTime} Please use this code to verify your account. Thank you! `
      );
      return { status: result?.status, token };
    }
  }

   async login(payload: {
    email?: string;
    phoneNumber?: string;
    password: string;
  }) {
    const { email, phoneNumber, password } = payload;

    if (!email && !phoneNumber) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email or phone number is required"
      );
    }

    // Ensure explicit query conditions to avoid unexpected matches
    const query: Record<string, string> = {};
    if (email) query.email = email.toLowerCase();
    if (phoneNumber) query.phone = phoneNumber;

    // Find user with strict match
    const isExist = await User.findOne(query);

    if (!isExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    }

    if (!isExist.password) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user credentials");
    }

    const isPasswordMatch = await encryptionOperation.comparePassword(
      password,
      isExist.password
    );

    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Wrong credentials");
    }

    const accessToken = this.jwt.createToken({
      userId: isExist._id,
      role: isExist.role,
    });

    const refreshToken = this.jwt.createToken(
      { userId: isExist._id, role: isExist.role },
      "30d"
    );

    isExist.password = undefined; // Remove sensitive data

    return { accessToken, refreshToken, user: isExist };
  }

  forgotPassword = async (payload: IUser, token: string) => {
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Your Otp is Expired");
    }
    // const hashedPassword = await bcrypt.hash(payload?.password, Number(config?.bcrypt_salt_round));
    const hashedPassword = await this.encryption.hashPassword(
      payload?.password as string
    );

    const decodedToken: string | JwtPayload = this.jwt.verifyToken(token);

    // check if token is valid or not
    if (!decodedToken || typeof decodedToken === "string") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to Verify OTP");
    }

    const { email, phoneNumber, provider, otp } = decodedToken;
    // check if email or phone number is same or not

    if (otp !== parseInt(payload?.otp as string as string)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Wrong OTP");
    }

    if (provider === "email") {
      payload.emailVerified = true;

      if (email !== payload?.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Email");
      }
      const result = await User.findOneAndUpdate(
        { email: payload?.email },
        { $set: { password: hashedPassword, emailVerified: true } },
        { new: true }
      );
      return result;
    }
    if (provider === "phone") {
      payload.phoneNumberVerified = true;
      if (phoneNumber !== payload?.phone) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Phone Number");
      }
      const isUser = await User.find({ phone: phoneNumber });

      if (isUser.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
      }

      const result = await User.findOneAndUpdate(
        { phone: phoneNumber },
        { $set: { password: hashedPassword, phoneNumberVerified: true } },
        { new: true }
      );

      return result;
    }

    // check if otp is same or not

    return null;
  };

  resetPassword = async (
    payload: { password: string; confirmPassword: string },
    user: JwtPayload | { userId: string }
  ) => {
    const isExist = await User.findOne({ _id: user?.userId });
    if (!isExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    }
    const { password, confirmPassword } = payload;
    if (password !== confirmPassword) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Password and Confirm Password not match"
      );
    }

    const hashedPassword = await this.encryption.hashPassword(password);

    const result = await User.findOneAndUpdate(
      { _id: user?.userId },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    return result;
  };

  async tokenLogin(payload: string) {
    const decodedToken: string | JwtPayload = this.jwt.verifyToken(
      payload
    ) as JwtPayload;

    if (!decodedToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Token");
    }
    const { userId, role } = decodedToken;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    }
    user.password = undefined;
    const accessToken = this.jwt.createToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = this.jwt.createToken(
      { userId: user._id, role: user.role },
      "30d"
    );
    if (role === "store") {
      return { user, accessToken, refreshToken };
    }

    return { user, accessToken, refreshToken };
  }
  async googleLogin(payload: {
    displayName: string;
    emails: { value: string }[];
  }) {
    const { displayName, emails } = payload;
    const email = emails[0].value;
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        name: displayName,
        email,
        emailVerified: true,
        role: "user",
      });

      await newUser.save();
    }

    // const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found");
    }
    user.password = undefined;
    const accessToken = this.jwt.createToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = this.jwt.createToken(
      { userId: user._id, role: user.role },
      "30d"
    );

    return { user, accessToken, refreshToken };
  }
}

const authService = new AuthService(
  config.jwt_secret as string,
  config.jwt_expire_in as string
);
export { AuthService };
export default authService;
