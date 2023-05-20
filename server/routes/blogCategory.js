const router = require("express").Router();
const ctrls = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get('/',ctrls.getCategories)
router.post('/',verifyAccessToken, isAdmin, ctrls.createCategory)
router.put('/update/:bid',verifyAccessToken, isAdmin, ctrls.updateCategory)
router.delete('/delete/:bid',verifyAccessToken, isAdmin, ctrls.deleteCategory)


module.exports = router;