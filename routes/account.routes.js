var express = require("express");
const AccountController = require("../controllers/accountController");

var router = express.Router();
router.get(
	"/dashboard",
	
	AccountController.profile
);

module.exports = router;