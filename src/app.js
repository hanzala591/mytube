import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.COR_ORIGIN,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
app.use("/user", userRouter);
export default app;
