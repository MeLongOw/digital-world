const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const createNewCoupon = asyncHandler(async (req, res) => {
    const { title, discount, expiry } = req.body;
    if (!title || !discount || !expiry)
        throw new Error("title, discount, expiry is required");

    if (discount > 100) throw new Error("Discount can not set over 100");

    if (!moment(expiry, "HH:mm:ss DD/MM/YYYY", true).isValid()) {
        throw new Error("Date is invalid");
    }

    req.body.expiry = moment(expiry, "HH:mm:ss DD/MM/YYYY").toDate();
    if (req.body.expiry < Date.now()) {
        throw new Error("Date is invalid");
    }

    const response = await Coupon.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : "Can not create new coupon",
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const { title } = req.query;
    let response;
    if (title) {
        response = await Coupon.find({ title }).select(
            "_id name discount expiry"
        );
    } else {
        response = await Coupon.find().select("_id title discount expiry");
    }
    return res.status(200).json({
        success: response ? true : false,
        coupons: response ? response : "Can not get coupons",
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { title, discount, expiry } = req.body;
    if (!title || !discount || !expiry)
    throw new Error("title, discount, expiry is required");
    if (req.body.discount > 100)
        throw new Error("Discount can not set over 100");
    if (!moment(expiry, "HH:mm:ss DD/MM/YYYY", true).isValid()) {
        throw new Error("Date is invalid");
    }

    req.body.expiry = moment(expiry, "HH:mm:ss DD/MM/YYYY").toDate();
    if (req.body.expiry < Date.now()) {
        throw new Error("Date is invalid");
    }

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

const deleteManyCoupons = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    const deleteCoupon = await Coupon.deleteMany({ _id: { $in: _ids } });
    return res.status(200).json({
        success: deleteCoupon ? true : false,
        deleteCoupon: deleteCoupon ? deleteCoupon : "Can not delete brands",
    });
});

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
    deleteManyCoupons,
};
