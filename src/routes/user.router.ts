import {
  getUserInformation,
  createStandardUser,
  createAdminStandardAccount,
  login,
  viewAllUsers,
  activateUser,
  deactivateUser,
  OAuthStandardUser
} from "./../controllers/user.controller";
import { Router } from "express";
import authenticate from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const userRouter = Router();

userRouter.get("/logged-in-user/profile", authenticate, getUserInformation);

userRouter.post("/standard/register", createStandardUser);

userRouter.post("/admin/register", createAdminStandardAccount);

userRouter.post("/standard/oauth/register", OAuthStandardUser);

userRouter.post("/login", login);

userRouter.get("/all", admin, viewAllUsers);

userRouter.put("/activate/:id", admin, activateUser);

userRouter.put("/deactivate/:id", admin, deactivateUser);

export default userRouter;
