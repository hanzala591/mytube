import connectionDB from "./db/index.db.js";
import dotenv from "dotenv";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: "./.env",
});
connectionDB()
  .then((res) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at port ${process.env.PORT}`);
    });
    console.log(process.env.CLOUDINARY_API_KEY);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });
  })
  .catch((err) => {
    console.log(err);
  });
