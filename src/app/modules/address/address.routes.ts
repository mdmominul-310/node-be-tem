import { Router } from "express";

import AddressController from "./address.controller";
import { USER_ROLE } from "../../../enum/user";
import auth from "../../middleware/auth";


const router: Router = Router();

router.route("/")
    .get(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.getAddresses)
    .post(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.createAddress)

router.route("/default")
    .get(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.getDefaultAddress)

router.route("/:id")
    .patch(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.updateAddress)
    .delete(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.deleteAddress)
    .get(auth(USER_ROLE.STORE, USER_ROLE.USER), AddressController.getAddress)




export { router as AddressRooutes }