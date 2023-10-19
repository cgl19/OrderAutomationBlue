

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

// working fine
router.get(
	"/addOrder",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.ordersAdd
);
// working fine
router.post(
	"/orders/paginate",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.orderPaginate
);
//working fine
router.post(
	"/orders/paginateAmazon",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.orderPaginateAmazon
);

// fileupload route
//working fine
router.post(
	"/addFile",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.addFile
);
// addorder Post Route
// working fine
router.post(
	"/addOrderProcess",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.addOrderProcess
	
);

// emailsender routes
//working fine
router.post(
	"/sendEmailAmazon",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.sendMailAmazon
);
// router.post(
// 	"/sendEmailAccount",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	amazonController.sendEmailAccount
// );

// export Order Route
// working fine
router.post(
	"/orders/exports",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.exportOrders
);
// working fine
router.get(
	"/order/download",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.downloadCsv
);

// amazonorder detail ID get Route
// working fine
router.get(
	"/amazonOrderDetail/:orderid",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.amazonOrderDetail
);

// editOrder Route
//working fine
router.get(
	"/amazonEdit/:id",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.amazonEdit
);
//working fine
router.post(
	"/amazonEdit",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.amazonEditOrder
);

// Duplicate Order Route
//working fine
router.get(
	"/duplicateOrder/:id",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.duplicateOrder
);

// amazon edit Order Get Route
// router.get(
// 	"/detailsOrderAccount/:orderId",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	amazonController.detailsOrderAccount
// );
//amazon edit Order submit Route
// router.post(
// 	"/updateRecordAccount",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	amazonController.updateOrderAccount
// );


// update status route
// working fine
router.post(
	"/updateStatus",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.updateStatus
);
//  rating Route
// working fine
router.post(
	"/ratingProcess",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	amazonController.rating
);



module.exports = router;