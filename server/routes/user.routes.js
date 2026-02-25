const { Router } = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    updateAccountDetails,
    checkAuth,
    requestPasswordReset,
    verifyOtp,
    resetPassword,
} = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");

const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/forgot-password").post(requestPasswordReset);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

router.route("/check-auth").get(checkAuth);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

module.exports = router;
