const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
router.get("/authregister/:token", ctrls.authRegister);
router.post("/login", ctrls.login);

router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.put("/current", verifyAccessToken, ctrls.updateUser);
router.put("/address", verifyAccessToken, ctrls.updateUserAddress);
router.put("/updatecart", verifyAccessToken, ctrls.updateCart);
router.put("/removeformcart", verifyAccessToken, ctrls.removeFormCart);
router.put("/addwishlist", verifyAccessToken, ctrls.updateWishList);
router.put("/removewishlist", verifyAccessToken, ctrls.removeWishList);

//[ADMIN]
router.get("/", verifyAccessToken, isAdmin, ctrls.getUsers);
router.delete("/delete", verifyAccessToken, isAdmin, ctrls.deleteUser);
router.delete("/deletemany", verifyAccessToken, isAdmin, ctrls.deleteManyUsers);
router.put("/update/:uid", verifyAccessToken, isAdmin, ctrls.updateUserByAdmin);

module.exports = router;
