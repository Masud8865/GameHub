const { Router } = require("express");
const { googleAuthInit, googleAuthCallback } = require("../controllers/oauth.controller");

const router = Router();

router.route("/google").get(googleAuthInit);
router.route("/callback/google").get(googleAuthCallback);

module.exports = router;