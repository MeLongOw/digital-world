const router = require("express").Router();
const ctrls = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get('/', ctrls.getBrands)
router.post('/', verifyAccessToken, isAdmin, ctrls.createBrand)
router.put('/update/:bid', verifyAccessToken, isAdmin, ctrls.updateBrand)
router.delete('/delete/:bid', verifyAccessToken, isAdmin, ctrls.deleteBrand)


module.exports = router;