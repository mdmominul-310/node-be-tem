import { Model, Types } from "mongoose";

type AddressType = 'Home' | 'Work' | 'Office' | 'Other';

export type IAddress = {
    id?: string;
    fullName: string;
    phoneNumber: string;
    landmark: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    policeStation: string;
    addressType: AddressType;
    isDefault: boolean;
    user: Types.ObjectId;
}


export type AddressModel = Model<IAddress>;