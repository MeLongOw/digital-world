const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const user = await User.findById(_id)
        .select("cart")
        .populate("cart.product", "title price");

    const products = user?.cart.map((item) => {
        return {
            product: item.product._id,
            count: item.quantity,
            color: item.color,
        };
    });

    let total = user?.cart.reduce(
        (sum, item) => +item.product.price * +item.quantity + sum,
        0
    );

    const createData = {
        products,
        total,
        orderBy: _id,
    };
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        total =
            Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
                1000 || total;
        createData.coupon = coupon;
        createData.total = total;
    }
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
    getOrders
};
