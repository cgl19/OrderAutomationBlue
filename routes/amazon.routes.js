

var express = require("express");
const AuthController = require("../controllers/authController");
const amazonController = require("../controllers/amazonController");
const AuthMiddleware = require("../middlewares/auth");

var router = express.Router();
//router.get('/', amazonController.profile)

router.get(
	"/",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.root
);

router.get(
	"/addOrder",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.ordersAdd
);

router.post(
	"/orders/paginate",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.orderPaginate
);
router.post(
	"/orders/paginateAmazon",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.orderPaginateAmazon
);






module.exports = router;