import { Schema, model } from "mongoose";
import { AddressModel, IAddress } from "./address.interface";

const addressSchema = new Schema<IAddress, AddressModel>({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: false
    },
    policeStation: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: false
    },
    addressLine2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    addressType: {
        type: String,
        enum: ['Home', 'Office', 'Other'],
        default: 'Home',
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})


const Address = model<IAddress, AddressModel>('Address', addressSchema);

export default Address;