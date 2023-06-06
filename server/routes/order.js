const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.get("/", verifyAccessToken, ctrls.getUserOrders);
router.get("/admin", verifyAccessToken, isAdmin, ctrls.getOrders);
router.put("/:oid", verifyAccessToken, ctrls.userCancelOrders);
router.put("/status/:oid", verifyAccessToken, isAdmin, ctrls.updateStatus);

module.exports = router;
