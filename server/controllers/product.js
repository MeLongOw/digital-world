const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
    if (!Object.keys(req.body).length) throw new Error("Missing input(s)");
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : "Can not create new product.",
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const {slug} = req.params;
    const product = await Product.findOne({slug});
    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : "Not found product.",
    });
});

const getProducts = asyncHandler(async (req, res) => {
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
    queryCommand.skip(skip).limit(limit);

    //Execute query
    queryCommand
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
            return res.status(500).json({ success: false, err: err.message });
        });
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updateProduct: updatedProduct ? updatedProduct : "Something went wrong",
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const deleteProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deleteProduct: deleteProduct ? deleteProduct : "Can not delete product",
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if ((!star, !pid)) throw new Error("Missing input(s)");
    const ratingProduct = await Product.findById(pid);
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
                },
            },
            {
                new: true,
            }
        );
    } else {
        //Add star and comment
        const response = await Product.findByIdAndUpdate(
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

const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) throw new Error("Missing input(s)");
    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $push: { images: { $each: req.files.map((file) => file.path) } },
        },
        { new: true }
    );
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
    ratings,
    uploadImagesProduct,
};
