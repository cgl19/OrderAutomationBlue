var express = require("express");
const AuthController = require("../controllers/authController");
const AdminController = require("../controllers/adminController");
const AuthMiddleware = require("../middlewares/auth");
var router = express.Router();
const { spawn } = require('child_process');




router.get(
	"/",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.root
);


router.post(
	"/new/filter",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.newFilter
);

router.get(
	"/profile",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AuthController.profile
);
router.post(
	"/profile",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AuthController.profileProcess
);

router.get(
	"/employees",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.employees
);
router.post(
	"/employees/add",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.addEmployeesProcess
);
router.post(
	"/employees/edit",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.editEmployeesProcess
);
router.get(
	"/employees/:id",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.employeeDetails
);
router.get(
	"/employees/:id/delete",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.deleteEmployeesProcess
);

router.post(
	"/employees/assign",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.assignTaskToEmployeesProcess
);

router.post(
	"/orders/paginate",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.orderPagination
);

router.get(
	"/orders",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.orders
);

router.get(
	"/orders/download",	
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.downloadCsv
);

router.get(
	"/orders/:id",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.ordersDetailAdmin
);


router.get(
	"/orders",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.orders
);


/////////////////////////////////////////
router.post(
	"/orders/exports",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	AdminController.exportOrders
);












module.exports = router;
