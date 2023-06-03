const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    let selectedCoupon;

    if (coupon) {
        selectedCoupon = await Coupon.findById(coupon);

        if (!selectedCoupon) throw new Error("Coupon does not exist");
    }

    const user = await User.findById(_id)
        .select("cart")
        .populate("cart.product", "title price");

    const products = user?.cart;

    let total = user?.cart.reduce(
        (sum, item) => +item.product.price * +item.quantity + sum,
        0
    );

    const shippingFee = Math.round(total * 0.02);

    const createData = {
        products,
        total,
        orderBy: _id,
    };
    if (coupon) {
        total =
            total - Math.round((total * +selectedCoupon?.discount) / 100) ||
            total;
        createData.coupon = coupon;
    }

    total = total + shippingFee;
    createData.total = total;

    const rs = await Order.create(createData);

    return res.status(200).json({
        success: rs ? true : false,
        rs: rs ? rs : "Can not create new order",
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error("Missing status");
    const response = await Order.findByIdAndUpdate(
        oid,
        { status },
        { new: true }
    );

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : "Can not update status",
    });
});

const getUserOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : "Can not update status",
    });
});

const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find();

    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : "Can not update status",
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrders,
    getOrders,
};
