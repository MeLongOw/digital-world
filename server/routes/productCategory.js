const router = require("express").Router();
const productCategoryControllers = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get('/',productCategoryControllers.getCategories)
router.post('/',verifyAccessToken, isAdmin, productCategoryControllers.createCategory)
router.put('/update/:pcid',verifyAccessToken, isAdmin, productCategoryControllers.updateCategory)
router.delete('/delete/:pcid',verifyAccessToken, isAdmin, productCategoryControllers.deleteCategory)


module.exports = router;