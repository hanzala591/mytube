import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { deletingFile } from "./deletingfile.js";

console.log(process.env.CLOUDINARY_API_KEY);
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      console.log("File Path is not given to upload on cloudinary.");
      return null;
    }
    const uploadImage = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    deletingFile(filePath);
    return uploadImage;
  } catch (error) {
    deletingFile(filePath);
    return null;
  }
};
export { uploadOnCloudinary };
