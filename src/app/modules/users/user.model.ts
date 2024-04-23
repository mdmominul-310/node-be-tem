import { Schema, model } from "mongoose";
import { IUser, Usermodel } from "./user.interface";
import { USER_ROLE } from "../../../enum/user";

const userSchema = new Schema<IUser, Usermodel>({
    name: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    phoneNumberVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,

    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/7930/7930853.png"
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: USER_ROLE,
        default: USER_ROLE.USER
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },

});

const User = model<IUser, Usermodel>('User', userSchema);
export default User;