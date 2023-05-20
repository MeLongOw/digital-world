const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.get("/", verifyAccessToken, ctrls.getUserOrders);
router.get("/admin", verifyAccessToken, isAdmin, ctrls.getUserOrders);
router.put("/status/:oid", verifyAccessToken, isAdmin, ctrls.getOrders);

module.exports = router;
