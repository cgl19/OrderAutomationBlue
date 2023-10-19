var express = require("express");
const accountController = require("../controllers/accountController");
var express = require("express");
const AuthController = require("../controllers/authController");
const AuthMiddleware = require("../middlewares/auth");
var router = express.Router();

var router = express.Router();
//fibe
router.get(
	"/dashboard",
	accountController.profile
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





//fine
router.get(
	'/account',
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.addAccountOrderProcess
	
  );
//fine
  router.get(
	"/detailsOrderAccount/:orderId",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.detailsOrderAccount
);


//fine
router.post(
	"/order/exports",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.exportOrders
);
//fine
router.get(
	"/order/download",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.downloadCsv
);
// working fine
router.post(
	"/updateRecordAccount",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.updateOrderAccount,
);



//working fine
router.post(
	"/sendEmailAccount",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.sendEmailAccount
);


router.post(
	"/orderRefresh",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.orderRefresh
);

//fine 
router.post(
	"/orders/paginate",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.orderPaginate
);

//fine
router.get(
	"/genratePo",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.generatePo
);
// working fine
router.post(
	"/updateStatus",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.updateStatus
);
// working fine 
router.get(
	"/detailsOrderAccount/:orderId",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.detailsOrderAccount
);
//working fine
router.get(
	"/editOrderAccount/:id",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.editRecord
);
//fine
router.post(
	"/editOrderAccount",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.editOrderAccount
);



router.post(
	"/addFile",
	AuthMiddleware.redirectToSigninIfNotAuthenticated,
	accountController.addFile
);




module.exports = router;