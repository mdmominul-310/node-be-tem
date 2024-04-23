import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAddress } from "./address.interface";
import Address from "./address.model";

const createAddress = async (address: IAddress): Promise<IAddress | null> => {
    if (address?.isDefault === true) {
        await Address.updateMany({ user: address.user }, { isDefault: false });
    }
    const result = await Address.create(address);
    return result;
}

const getAddresses = async (userId: string): Promise<IAddress[]> => {
    const result = await Address.find({ user: userId });
    return result;
}

const getAddress = async (addressId: string): Promise<IAddress | null> => {
    const result = await Address.findById(addressId);
    return result;
}

const getDefaultAddress = async (userId: string): Promise<IAddress | null> => {
    const result = await Address.findOne({ user: userId, isDefault: true });
    return result;
}

const updateAddress = async (addressId: string, userId: string, address: IAddress): Promise<IAddress | null> => {
    const isExist = await Address.findOne({ _id: addressId, user: userId });
    if (!isExist) throw new ApiError(httpStatus.CONFLICT, "Address not found");
    if (address?.isDefault === true || address?.isDefault === false) {
        await Address.updateMany({ user: userId }, { isDefault: false });
    }
    const result = await Address.findOneAndUpdate({ _id: addressId, user: userId }, address, { new: true });
    return result;
}

const deleteAddress = async (addressId: string, userId: string): Promise<IAddress | null> => {
    const result = await Address.findOneAndDelete({ _id: addressId, user: userId });
    return result;
}


const AddressService = {
    createAddress,
    getAddresses,
    getAddress,
    getDefaultAddress,
    updateAddress,
    deleteAddress
}

export default AddressService;
