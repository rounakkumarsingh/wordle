import asyncHandler from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { EMPTY_PROFILE_PICTURE } from "../constant.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        // Skipping validation before save to avoid re-validation of already validated fields
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *                 required: true
 *               username:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               profile-picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, username } = req.body;
    if (
        [fullName, email, username, password].some((field) => {
            return field?.trim() === "";
        })
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const profilePictureLocalPath = req.file?.path;

    const profilePicture = profilePictureLocalPath
        ? await uploadOnCloudinary(profilePictureLocalPath)
        : { url: EMPTY_PROFILE_PICTURE };

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        profilePicture: profilePicture.url,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 required: true
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Set-Cookie:
 *             description: Cookies containing access and refresh tokens. These cookies are HTTP-only and secure.
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *     description: Either username or email must be provided along with the password to login.
 */
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User doesn't exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "User doesn't exist.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    user.refreshToken = refreshToken;

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                loggedInUser,
            })
        );
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully"));
});

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Find user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username to find
 *     responses:
 *       200:
 *         description: User found successfully
 *       400:
 *         description: Username is required
 *       404:
 *         description: User not found
 */
const findUser = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username is required to search!!!");
    }

    const user = await User.findOne({ username }).select(
        "-email -password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User found successfully"));
});

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Unauthorized
 *     description: Either cookie or request body must contain the refresh token.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh Token is expired or wrong");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invlaid Refresh Token");
    }
});

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change current password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 required: true
 *               newPassword:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user?._id;
    const user = await User.findById(userId);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false }); // Skipping validation before save to avoid re-validation of already validated fields

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

/**
 * @swagger
 * /users/current-user:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

/**
 * @swagger
 * /users/update-account:
 *   patch:
 *     summary: Update account details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account details updated successfully
 *       400:
 *         description: Bad request
 *      description: atleast one of fullName, email, username is required.
 */
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, username } = req.body;

    if (!fullName && !email && !username) {
        throw new ApiError(400, "All fileds are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName || req.user.fullName,
                email: email || req.user.email,
                username: username || req.user.username,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account Details updated successfully")
        );
});

/**
 * @swagger
 * /users/update-profile-picture:
 *   patch:
 *     summary: Update profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile-picture:
 *                 type: string
 *                 required: true
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Bad request
 */
const updateProfilePicture = asyncHandler(async (req, res) => {
    const profilePictureLocalPath = req.file?.path;

    if (!profilePictureLocalPath) {
        throw new ApiError(400, "No new profile picture uploaded");
    }

    const newCloudinaryProfilePicture = await uploadOnCloudinary(
        profilePictureLocalPath
    );

    if (!newCloudinaryProfilePicture.url) {
        throw new ApiError(400, "Error while uploading profile picture");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { profilePicture: newCloudinaryProfilePicture.url },
        },
        { new: true }
    ).select("-password");

    if (req.user.profilePicture !== EMPTY_PROFILE_PICTURE) {
        await deleteFromCloudinary(req.user.profilePicture);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile Picture updated successfully")
        );
});

/**
 * @swagger
 * /users/remove-profile-picture:
 *   delete:
 *     summary: Delete profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *       400:
 *         description: Bad request
 */
const deleteProfilePicture = asyncHandler(async (req, res) => {
    if (req.user.profilePicture === EMPTY_PROFILE_PICTURE) {
        throw new ApiError(400, "No profile image to delete");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { profilePicture: EMPTY_PROFILE_PICTURE },
        },
        { new: true }
    ).select("-password");

    await deleteFromCloudinary(req.user.profilePicture);

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile Picture deleted successfully")
        );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    findUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateProfilePicture,
    deleteProfilePicture,
};
