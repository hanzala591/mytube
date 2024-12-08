import connectionDB from "./db/index.db.js";
import dotenv from "dotenv";
dotenv.config();
connectionDB()
  .then((res) => {
    console.log(`Server is listening at port ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
