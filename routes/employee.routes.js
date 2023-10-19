var express = require("express");
const AuthController = require("../controllers/authController");
const EmployeeController = require("../controllers/employeeController");
const AuthMiddleware = require("../middlewares/auth");
var router = express.Router();

// router.get(
// 	"/",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.root
// );
// router.get(
// 	'/account',
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.addAccountOrderProcess
	
//   );


router.get(
	"/profile",
	//AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AuthController.profile
);
router.post(
	"/profile",
	//AuthMiddleware.redirectToSigninIfNotAuthenticated,
	 AuthController.profileProcess
);


// router.post(
// 	"/addOrderProcess",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.addOrderProcess
	
// );
// router.get(
// 	"/addOrder",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.ordersAdd
// );




// router.get(
// 	"/detailsOrderAccount/:orderId",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.detailsOrderAccount
// );

// router.post(
// 	"/updateRecordAccount",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.updateOrderAccount
// );
// router.post(
// 	"/orderRefresh",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.orderRefresh
// );

// router.get(
// 	"/amazonOrderDetail/:orderid",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.amazonOrderDetail
// );
// router.post(
// 	"/addFile",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.addFile
// );
// router.post(
// 	"/orders/paginate",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.orderPaginate
// );
// router.post(
// 	"/orders/paginateAmazon",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.orderPaginateAmazon
// );




// ////////////these routes are responsible for the exporting and generating csv for both Amazon Employee and Account Employee
// router.post(
// 	"/orders/exports",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.exportOrders
// );
// router.get(
// 	"/order/download",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.downloadCsv
// );
// router.post(
// 	"/updateStatus",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.updateStatus
// );
// router.post(
// 	"/refurb",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.refurb,
// );
// router.get(
// 	"/editOrderAccount/:id",
// 	 AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.editRecord
// );
// router.post(
// 	"/editOrderAccount",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.editOrderAccount
// );
// // router.get(
// // 	"/genratePo",
// // 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// // 	EmployeeController.generatePo
// // );
// router.post(
// 	"/ratingProcess",
// 	AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.rating
// );

// router.get(
// 	"/duplicateOrder/:id",
// 	// AuthMiddleware.redirectToSigninIfNotAuthenticated,
// 	EmployeeController.duplicateOrder
// );

// /////////////////////////////////////////////////

module.exports = router;
