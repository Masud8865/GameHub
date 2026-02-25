const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const Otp = require("../models/otp.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/otpMailer");
const { sendPasswordResetSuccessEmail } = require("../utils/passwordResetMailer");
const generateAccessAndAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating referesh and access token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (
        [email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username/email and password are required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email: username }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndAccessTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const checkAuth = asyncHandler(async (req, res) => {
    let isAuthenticated = false;
    let userData = null;

    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
            if (user) {
                isAuthenticated = true;
                userData = user;
            }
        }
    } catch (error) {
        isAuthenticated = false;
        userData = null;
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { isAuthenticated, user: userData }, "Authentication checked"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const requestPasswordReset = asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email: username || email }],
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.create({
        userId: user._id,
        hashedOtp,
        expiresAt
    });

    await sendOtpEmail(user.email, otp);

    return res.status(200).json(new ApiResponse(200, {}, "OTP sent to registered email"));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { username, email, otp } = req.body;

    if ((!username && !email) || !otp) {
        throw new ApiError(400, "Username/email and OTP are required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email: username || email }],
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otpRecord = await Otp.findOne({
        userId: user._id,
        isUsed: false,
        expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    if (otpRecord.attemptCount >= 5) {
        throw new ApiError(400, "Maximum OTP attempts exceeded. Request a new OTP.");
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.hashedOtp);

    if (!isOtpValid) {
        otpRecord.attemptCount += 1;
        await otpRecord.save();
        throw new ApiError(400, "Invalid OTP");
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = await bcrypt.hash(resetToken, 10);
    user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins for reset
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { resetToken }, "OTP verified successfully. Use the reset token to set a new password."));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { username, email, resetToken, newPassword } = req.body;

    if ((!username && !email) || !resetToken || !newPassword) {
        throw new ApiError(400, "Username/email, resetToken, and new password are required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email: username || email }],
        resetTokenExpires: { $gt: new Date() }
    });

    if (!user || !user.resetToken) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    const isTokenValid = await bcrypt.compare(resetToken, user.resetToken);

    if (!isTokenValid) {
        throw new ApiError(400, "Invalid reset token");
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.refreshToken = undefined;

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetSuccessEmail(user.email);

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully. Active sessions invalidated."));
});

module.exports = {
    registerUser,
    loginUser,
    checkAuth,
    logoutUser,
    updateAccountDetails,
    changeCurrentPassword,
    requestPasswordReset,
    verifyOtp,
    resetPassword,
};
