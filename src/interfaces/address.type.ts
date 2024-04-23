import { Model } from "mongoose"

export type IAddress = {
    id?: string,
    country: string,
    city: string,
    policeStation: string,
    postCode: string,
    streetAddress: string,
}

export type AddressModel = Model<IAddress>;