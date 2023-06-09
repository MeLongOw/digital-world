const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const Brand = require("../models/brand");
const Order = require("../models/order");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const {
    getDifferentElementsFromArrays,
    arraysEqual,
} = require("../utils/helper");

const createProduct = asyncHandler(async (req, res) => {
    if (!Object.keys(req.body).length) throw new Error("Missing input(s)");
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const { variants } = req.body;

    //Check total of variant wether on not equal
    const quantitiesEachVariant = variants.map((el) =>
        el.variants.reduce((total, el) => (total += el.quantity), 0)
    );
    if (!quantitiesEachVariant?.every((el) => el === quantitiesEachVariant[0]))
        throw new Error("Total of variants have to be equal");
    // const quantity = Math.max(...quantitiesEachVariant);
    // if (quantity) req.body.quantity = +quantity;



    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : "Can not create new product.",
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
        .populate("brand")
        .populate("category")
        .populate({
            path: "ratings.postedBy",
            select: "firstName lastName -_id",
        });
    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : "Not found product.",
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const { brand, category, ...queries } = { ...req.query };

    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    if (!queries?.price) queries.price = { gt: 0 };
    // Format operator Mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formattedQueries = JSON.parse(queryString);

    //Filtering
    if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };

    let queryCommand = Product.find(formattedQueries);

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
    if (category && brand) {
        ProductCategory.findOne({ title: { $regex: category, $options: "i" } })
            .exec()
            .then(async (category) => {
                const brandMacthed = await Brand.findOne({
                    title: { $regex: brand, $options: "i" },
                });

                queryCommand
                    .find({ category: category?._id, brand: brandMacthed?._id })
                    .skip(skip)
                    .limit(limit)
                    .populate("brand")
                    .populate("category")
                    .exec()
                    .then(async (products) => {
                        const counts = await Product.find({
                            category: category?._id,
                        }).countDocuments();
                        return res.status(200).json({
                            success: products ? true : false,
                            counts,
                            products: products
                                ? products
                                : "Can not get products.",
                        });
                    });
            });
    } else if (category) {
        ProductCategory.findOne({ title: { $regex: category, $options: "i" } })
            .exec()
            .then((category) => {
                queryCommand
                    .find({ category: category?._id })
                    .skip(skip)
                    .limit(limit)
                    .populate("brand")
                    .populate("category")
                    .exec()
                    .then(async (products) => {
                        const counts = await Product.find({
                            category: category?._id,
                        }).countDocuments();
                        return res.status(200).json({
                            success: products ? true : false,
                            counts,
                            products: products
                                ? products
                                : "Can not get products.",
                        });
                    });
            });
    } else if (brand) {
        Brand.findOne({ title: { $regex: brand, $options: "i" } })
            .exec()
            .then((brand) => {
                queryCommand
                    .find({ brand: brand?._id })
                    .skip(skip)
                    .limit(limit)
                    .populate("brand")
                    .populate("category")
                    .exec()
                    .then(async (products) => {
                        const counts = await Product.find({
                            brand: brand?._id,
                        }).countDocuments();
                        return res.status(200).json({
                            success: products ? true : false,
                            counts,
                            products: products
                                ? products
                                : "Can not get products.",
                        });
                    });
            });
    } else {
        queryCommand.skip(skip).limit(limit);

        queryCommand
            .populate("category")
            .populate("brand")
            .exec()
            .then(async (response) => {
                const counts = await Product.find(
                    formattedQueries
                ).countDocuments();

                return res.status(200).json({
                    success: response ? true : false,
                    counts,
                    products: response ? response : "Can not get products.",
                });
            })
            .catch((err) => {
                return res
                    .status(500)
                    .json({ success: false, err: err.message });
            });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        if (!req.body?.slug) req.body.slug = slugify(req.body.title);
    }

    //Check total of variant wether on not equal
    const { variants } = req.body;
    const quantitiesEachVariant = variants.map((el) =>
        el.variants.reduce((total, el) => (total += el.quantity), 0)
    );
    console.log({quantitiesEachVariant})
    if (!quantitiesEachVariant?.every((el) => el === quantitiesEachVariant[0]))
        throw new Error("Total of variants have to be equal");
    const quantity = Math.max(...quantitiesEachVariant);
    if (quantity) req.body.quantity = +quantity;

    const beforeUpdated = await Product.findById(pid);
    let updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });

    if (updatedProduct) {
        const pendingRemoveFromCloudImgs = getDifferentElementsFromArrays(
            beforeUpdated.images,
            updatedProduct.images
        );
        if (pendingRemoveFromCloudImgs.length) {
            promises = pendingRemoveFromCloudImgs?.map((imageURL) => {
                return cloudinary.uploader.destroy(
                    imageURL.split("/").slice(-2).join("/").split(".")[0]
                );
            });
            await Promise.all(promises);
        } else {
            if (arraysEqual(beforeUpdated.images, updatedProduct.images)) {
                updatedProduct = await Product.findByIdAndUpdate(
                    pid,
                    { thumb: updatedProduct.images[0] },
                    {
                        new: true,
                    }
                );
            }
        }
    }
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updateProduct: updatedProduct ? updatedProduct : "Something went wrong",
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(pid);

    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? deleteProduct : "Can not delete product",
    });
});
const deleteManyProducts = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    const deleteProduct = await Product.deleteMany({ _id: { $in: _ids } });
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct
            ? deleteProduct
            : "Can not delete products",
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, oid } = req.body;
    if (!star || !pid || !oid) throw new Error("Missing input(s)");
    const ratingProduct = await Product.findById(pid);
    const authOrder = await Order.findById(oid);
    if (
        authOrder?.orderBy.toString() !== _id &&
        !authOrder?.products.some((el) => el.product === pid)
    )
        throw new Error("Not found product in this order of this user");
    const alreadyRating = ratingProduct?.ratings?.find(
        (rating) => rating.postedBy.toString() === _id
    );
    if (alreadyRating) {
        //Update star and comment
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                    "ratings.$.createdAt": Date.now(),
                },
            },
            {
                new: true,
            }
        );
    } else {
        //Add star and comment
        await Product.findByIdAndUpdate(
            pid,
            {
                $push: { ratings: { star, comment, postedBy: _id } },
            },
            { new: true }
        );
    }
    // Total rating
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce(
        (sum, ele) => sum + +ele.star,
        0
    );
    updatedProduct.totalRatings =
        Math.round((sumRatings * 10) / ratingCount) / 10;
    updatedProduct.save();

    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});

const getAllRatings = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Format operator Mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    let formattedQueries = JSON.parse(queryString);

    //Filtering
    if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: "i" };

    if (queries?.ratings?._id)
        formattedQueries = { "ratings._id": queries?.ratings?._id };
    if (queries?.ratings?.star)
        formattedQueries = { "ratings.star": queries?.ratings?.star };
    if (queries?.ratings?.postedBy)
        formattedQueries = { "ratings.postedBy": queries?.ratings?.postedBy };

    let queryCommand = Product.find({
        $and: [{ ratings: { $exists: true, $ne: [] } }, formattedQueries],
    });

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
    queryCommand.skip(skip).limit(limit);

    queryCommand
        .populate({ path: "ratings.postedBy", select: "firstName lastName" })
        .select("_id title ratings.star ratings._id ratings.comment")
        .exec()
        .then(async (response) => {
            const counts = await Product.countDocuments({
                $and: [
                    { ratings: { $exists: true, $ne: [] } },
                    formattedQueries,
                ],
            });

            return res.status(200).json({
                success: response ? true : false,
                counts,
                products: response ? response : "Can not get product ratings.",
            });
        })
        .catch((err) => {
            return res.status(500).json({ success: false, err: err.message });
        });
});

const deleleProductRating = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { rid } = req.body;
    const deleteProductRating = await Product.findByIdAndUpdate(
        pid,
        {
            $pull: {
                ratings: {
                    _id: rid,
                },
            },
        },
        { new: true }
    );

    return res.status(200).json({
        success: deleteProductRating ? true : false,
        deleteProductRating: deleteProductRating
            ? deleteProductRating
            : "Can not delete product rating",
    });
});
const deleteManyProductRatings = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    if (!_ids?.length) throw new Error("Missing input (_ids)");

    promises = _ids.map(({ pid, rid }) =>
        Product.findByIdAndUpdate(
            pid,
            {
                $pull: {
                    ratings: {
                        _id: rid,
                    },
                },
            },
            { new: true }
        )
    );
    const response = await Promise.all(promises);
    return res.status(200).json({
        success: response ? true : false,
    });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.file) throw new Error("Missing input(s)");
    const product = await Product.findByIdAndUpdate(
        pid,
        {
            $push: { images: req.file.path },
        },
        { new: true }
    );
    let response;
    if (product && !product.thumb) {
        response = await Product.findByIdAndUpdate(
            pid,
            {
                thumb: product.images[0],
            },
            { new: true }
        );
    } else {
        response = product;
    }

    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : "Can not upload images ",
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    deleteManyProducts,
    uploadImageProduct,
    ratings,
    getAllRatings,
    deleleProductRating,
    deleteManyProductRatings,
};
