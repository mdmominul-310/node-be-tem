import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { AddressRooutes } from "../modules/address/address.routes";
import { sendEmailRouter } from "../modules/send-email/send-email.controller";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/address",
    route: AddressRooutes,
  },
  {
    path: "/send-email",
    route: sendEmailRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
