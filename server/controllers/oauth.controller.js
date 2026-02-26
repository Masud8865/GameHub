const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const crypto = require("crypto");
const axios = require("axios");

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

const googleAuthInit = asyncHandler(async (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        throw new ApiError(500, "Google OAuth credentials are not properly configured");
    }

    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    return res.redirect(url);
});

const googleAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=Google authorization failed`);
    }

    try {
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, email, name, picture } = userResponse.data;

        let user = await User.findOne({ email });

        if (!user) {
            // Check if username is taken (e.g. from email prefix)
            let baseUsername = email.split('@')[0].toLowerCase();
            let username = baseUsername;
            let count = 1;
            while (await User.findOne({ username })) {
                username = `${baseUsername}${count}`;
                count++;
            }

            // Generate a secure random password since Google handles auth
            const randomPassword = crypto.randomBytes(16).toString('hex');

            user = await User.create({
                email,
                username,
                password: randomPassword,
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndAccessTokens(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`${process.env.CLIENT_URL}/`); // Redirect home after successful login
    } catch (error) {
        console.error("Google OAuth Error:", error.response?.data || error.message);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=Google authorization failed`);
    }
});

module.exports = {
    googleAuthInit,
    googleAuthCallback
};
