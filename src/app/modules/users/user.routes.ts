import { Router } from "express";
import userController from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../../enum/user";

const router: Router = Router();
router.route("/")
    .get(auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,), userController.getAllUser)
    .patch(auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.STORE, USER_ROLE.USER), userController.updateUser)
router.route("/create")
    .post(userController.createUser)
router.route("/send-otp")
    .post(userController.sendOtpUserVerify)


export { router as userRoutes };   