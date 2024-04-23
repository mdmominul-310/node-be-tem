import { Request, Response } from "express";
import AddressService from "./address.service";
import { IAddress } from "./address.interface";
import catchAsync from "../../../helpers/catchAsync";
import responseReturn from "../../../helpers/responseReturn";

const createAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId
    const address = {
        ...req.body,
        user: userId
    }
    const result = await AddressService.createAddress(address);

    responseReturn<IAddress>(res, {
        success: true,
        data: result,
        message: 'Address created successfully'
    })
})

const getAddresses = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId
    const result = await AddressService.getAddresses(userId);

    responseReturn<IAddress[]>(res, {
        success: true,
        data: result,
        message: 'Addresses fetched successfully'
    })
})

const getAddress = catchAsync(async (req: Request, res: Response) => {
    const addressId = req.params.id;
    const result = await AddressService.getAddress(addressId);

    responseReturn<IAddress>(res, {
        success: true,
        data: result,
        message: 'Address fetched successfully'
    })
})

const getDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId
    const result = await AddressService.getDefaultAddress(userId);

    responseReturn<IAddress>(res, {
        success: true,
        data: result,
        message: 'Address fetched successfully'
    })
})


const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId
    const addressId = req.params.id;
    const address = req.body;
    const result = await AddressService.updateAddress(addressId, userId, address);

    responseReturn<IAddress>(res, {
        success: true,
        data: result,
        message: 'Address updated successfully'
    })
})

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId
    const addressId = req.params.id;
    const result = await AddressService.deleteAddress(addressId, userId);

    responseReturn<IAddress>(res, {
        success: true,
        data: result,
        message: 'Address deleted successfully'
    })
})

const AddressController = {
    createAddress,
    getAddresses,
    getAddress,
    getDefaultAddress,
    updateAddress,
    deleteAddress
}

export default AddressController;