const router = require("express").Router();
const ctrls = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, isAdmin, ctrls.createNewCoupon);
router.get("/", ctrls.getCoupons);
router.put("/update/:cid", verifyAccessToken, isAdmin, ctrls.updateCoupon);
router.delete("/delete/:cid", verifyAccessToken, isAdmin, ctrls.deleteCoupon);
router.delete('/deletemany', verifyAccessToken, isAdmin, ctrls.deleteManyCoupons)



module.exports = router;
