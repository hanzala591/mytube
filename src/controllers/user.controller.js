import { asyncHandle } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deletingFile } from "../utils/deletingfile.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateWebToken();
    const refreshToken = await user.generateRefreshToken();
    console.log(accessToken);
    console.log(refreshToken);
    if (!accessToken || !refreshToken) {
      throw new ApiError(401, "Access Or Refresh Token is not generated");
    }
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error in Create Access token or Refresh Token");
  }
};
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

const logInUser = asyncHandle(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(401, "Username or email is empty.");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(500, "User is not found.");
  }
  const matchPassword = await user.matchPassword(password);
  if (!matchPassword) {
    throw new ApiError(401, "Password is not match.");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };
  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(200, {
        user: logInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logOutUser = asyncHandle(async (req, res) => {
  //get current user
  //delete access and refresh cookie

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, req.user));
});

const generateAccessToken = asyncHandle(async (req, res) => {});
export { registeredUser, logInUser, logOutUser };
