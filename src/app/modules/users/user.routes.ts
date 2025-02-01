import { Router } from "express";
import userController from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../../enum/user";
import multer from "multer";

const router: Router = Router();
const upload = multer({});
router
  .route("/")
  .get(auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), userController.getAllUser)
  .patch(
    auth(
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.STORE,
      USER_ROLE.USER
    ),
    upload.fields([
      {
        name: "data",
        maxCount: 1,
      },
      {
        name: "profile",
        maxCount: 1,
      },
    ]),
    userController.updateUser
  );

router
  .route("/:id")
  .delete(
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    userController.deleteUser
  )

  .patch(
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    userController.updateUserAdmin
  );

router.route("/create").post(
  upload.fields([
    {
      name: "data",
      maxCount: 1,
    },
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  userController.createUser
);
router.route("/send-otp").post(userController.sendOtpUserVerify);

export { router as userRoutes };
