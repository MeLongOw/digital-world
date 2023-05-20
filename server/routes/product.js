const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require('../configs/cloudinary.config')

router.get('/', ctrls.getProducts)
router.get('/get/:slug',ctrls.getProduct)

router.put('/ratings', verifyAccessToken, ctrls.ratings)

router.post("/", verifyAccessToken, isAdmin, ctrls.createProduct);
router.put("/uploadimage/:pid", verifyAccessToken, isAdmin , uploader.array('images'), ctrls.uploadImagesProduct);
router.put("/update/:pid", verifyAccessToken, isAdmin, ctrls.updateProduct);
router.delete("/delete/:pid", verifyAccessToken, isAdmin, ctrls.deleteProduct);
module.exports = router;
