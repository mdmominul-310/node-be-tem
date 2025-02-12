import { Model } from "mongoose";

export type IUser = {
  _id?: string;
  id?: string;
  name?: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneNumberVerified: boolean;
  email: string;
  emailVerified: boolean;
  password: string | undefined;
  profileImage: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  role: string;
  status?: string;
  oldPassword?: string;
  otp?: string;
  provider?: string;
};

export type Usermodel = Model<IUser>;
