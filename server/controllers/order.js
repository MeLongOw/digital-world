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
        rs: response ? response : "Can not update status",
    });
});

const getUserOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });

    return res.status(200).json({
        success: response ? true : false,
        userOrder: response ? response : "Can not update status",
    });
});

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);
    // Format operator Mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formattedQueries = JSON.parse(queryString);
    //Filtering
    if (queries?.coupon) {
        const selectedCoupon = await Coupon.find({
            title: { $regex: queries.coupon, $options: "i" },
        }).select("_id");
        if (selectedCoupon) {
            formattedQueries.coupon = selectedCoupon;
        }
    }
    if (queries?.email) {
        const selectedUser = await User.find({
            email: { $regex: queries.email, $options: "i" },
        }).select("_id");
        if (selectedUser) {
            formattedQueries.orderBy = selectedUser;
        }
        formattedQueries.email = undefined;
    }

    if (queries?.phone) {
        const selectedUser = await User.find({
            phone: { $regex: queries.phone, $options: "i" },
        }).select("_id");
        if (selectedUser) {
            formattedQueries.orderBy = selectedUser;
        }
        formattedQueries.phone = undefined;
    }

    if (queries?.status)
        formattedQueries.status = {
            $regex: queries.status,
            $options: "i",
        };
    let queryCommand = Order.find(formattedQueries);
    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand.sort(sortBy);
    }
    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand.select(fields);
    }
    //Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    //Execute query
    queryCommand
        .skip(skip)
        .limit(limit)
        .populate("products.product")
        .populate("coupon")
        .populate("orderBy")
        .populate("createdAt")
        .select(
            "Orderby.firstName Orderby.lastName Orderby.email products status coupon _id"
        )
        .exec()
        .then(async (response) => {
            const counts = await Order.find(formattedQueries).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                orders: response ? response : "Can not get products.",
            });
        });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrders,
    getOrders,
};
