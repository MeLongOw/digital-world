const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry)
        throw new Error("name, discount, expiry is required");
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : "Can not create new coupon",
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select("_id name discount expiry");
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : "Can not get coupons",
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (req.body.expiry)
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : "Can not update coupon",
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : "Can not delete coupon",
    });
});

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
