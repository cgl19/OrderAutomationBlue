var express = require("express");
const AuthController = require("../controllers/authController");
const AuthMiddleware = require("../middlewares/auth.js");
var router = express.Router();

router.get("/", AuthController.root);

router.get(
	"/signin",
	AuthMiddleware.redirectFromSigninSignupPages,
	AuthController.signIn
);

router.post(
	"/signin",
	AuthMiddleware.redirectFromSigninSignupPages,
	AuthController.signInProcess
);

router.get("/logout", AuthController.logout);

module.exports = router;
