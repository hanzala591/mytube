import { Router } from "express";
import {
  registeredUser,
  logInUser,
  logOutUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/uploadimage.middleware.js";
import { userverify } from "../middlewares/user.middleware.js";
const userRouter = Router();

userRouter.route("/registeredUser").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coveredImage",
      maxCount: 1,
    },
  ]),
  registeredUser
);

userRouter.route("/logInUser").post(logInUser);

userRouter.route("/logOutUser").post(userverify, logOutUser);
export default userRouter;
