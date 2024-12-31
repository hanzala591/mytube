import { Router } from "express";
import { registeredUser } from "../controllers/user.controller.js";
import upload from "../middlewares/uploadimage.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(
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

export default userRouter;
