import { asyncHandle } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deletingFile } from "../utils/deletingfile.js";

const registeredUser = asyncHandle(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  const avatarLocalPath = req?.files?.avatar[0]?.path;
  const coveredImageLocalPath = req?.files?.coveredImage[0]?.path;
  if (
    [username, email, fullName, password].some((value) => value?.trim() === "")
  ) {
    deletingFile(avatarLocalPath);
    deletingFile(coveredImageLocalPath);
    throw new ApiError("400", "One fields is empty.");
  }

  const existedUser = await User.findOne({
    $or: [{ email, fullName }],
  });
  if (existedUser) {
    deletingFile(avatarLocalPath);
    deletingFile(coveredImageLocalPath);
    throw new ApiError(409, "User is Already Existed.");
  }
  if (!avatarLocalPath) {
    deletingFile(avatarLocalPath);
    deletingFile(coveredImageLocalPath);
    throw new ApiError(400, "Avatar image is not upload on server.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coveredImage = await uploadOnCloudinary(coveredImageLocalPath);
  const createdUser = await User.create({
    username,
    email,
    fullName,
    avatar: avatar?.url,
    coveredImage: coveredImage?.url || "",
    password,
  });
  const user = await User.findById(createdUser._id).select("-password");
  if (!user) {
    deletingFile(avatarLocalPath);
    deletingFile(coveredImageLocalPath);
    throw new ApiError(
      400,
      "After User Creation not Remove password and Refresh Token."
    );
  }
  return res.status(200).json(new ApiResponse(200, user));
});

export { registeredUser };
