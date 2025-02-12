import { Router } from "express";
import authController from "./auth.controller";
import { USER_ROLE } from "../../../enum/user";
import auth from "../../middleware/auth";
import passport from "passport";
const router: Router = Router();
router
  .route("/login")
  .post(authController.login)
  .get(authController.tokenLogin);
router
  .route("/login/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.googleLogin
);
router.post("/verify-email-or-phone", authController.verifyEmailOrPhone);
router.route("/logout").post(authController.logOut);
router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/reset-password",
  auth(USER_ROLE.STORE, USER_ROLE.USER),
  authController.resetPassword
);
export { router as authRoutes };
