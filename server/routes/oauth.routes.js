const { Router } = require("express");
const {
    googleAuthInit,
    googleAuthCallback,
    githubAuthInit,
    githubAuthCallback
} = require("../controllers/oauth.controller");

const router = Router();

router.route("/google").get(googleAuthInit);
router.route("/callback/google").get(googleAuthCallback);

router.route("/github").get(githubAuthInit);
router.route("/callback/github").get(githubAuthCallback);

module.exports = router;