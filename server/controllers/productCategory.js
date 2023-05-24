const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
    console.log(req.body);
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdProdCategory: response ? response : "Can not create category",
    });
});

const getCategories = asyncHandler(async (req, res) => {
    if (req.query?.title) {
        // const response = await ProductCategory.find({
        //     title: {
        //         $regex: req.query.title,
        //         $options: "i",
        //     },
        // })
        //     .sort("-createdAt")
        //     .populate("brand")
        //     .populate("productCount");

        const response = await ProductCategory.aggregate([
            {
                $match: {
                    title: {
                        $regex: req.query.title,
                        $options: "i",
                    },
                },
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $lookup: {
                    from: "products", 
                    localField: "_id",
                    foreignField: "category",
                    as: "productCount",
                },
            },
            {
                $project: {
                    title: 1,
                    brand: 1,
                    image: 1,
                    productCount: { $size: "$productCount" },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);


        return res.status(200).json({
            success: response ? true : false,
            prodCategories: response ? response : "Can not get categories",
        });
    } else {
        // const response = await ProductCategory.find()
        //     .sort("-createdAt")
        //     .populate("productCount")
        //     .populate("brand");

        const response = await ProductCategory.aggregate([
            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $lookup: {
                    from: "products", 
                    localField: "_id",
                    foreignField: "category",
                    as: "productCount",
                },
            },
            {
                $project: {
                    title: 1,
                    brand: 1,
                    image: 1,
                    productCount: { $size: "$productCount" },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        return res.status(200).json({
            success: response ? true : false,
            prodCategories: response ? response : "Can not get categories",
        });
    }
});

const uploadImageCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    if (!req.file) throw new Error("Missing input(s)");
    console.log(pcid);
    const response = await ProductCategory.findByIdAndUpdate(
        pcid,
        {
            image: req.file.path,
        },
        { new: true }
    ).populate("brand");
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : "Can not upload image",
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
        new: true,
    });

    return res.status(200).json({
        success: response ? true : false,
        updatedProdCategory: response
            ? response
            : response?.errors
            ? response.errors
            : "Not found this pcid in DB",
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        deletedProdCategory: response
            ? response
            : response?.errors
            ? response.errors
            : "Not found this pcid in DB",
    });
});

const deleteManyCategories = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    const deleteCategory = await ProductCategory.deleteMany({
        _id: { $in: _ids },
    });
    return res.status(200).json({
        success: deleteCategory ? true : false,
        deleteCategory: deleteCategory
            ? deleteCategory
            : "Can not delete categories",
    });
});

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    deleteManyCategories,
    uploadImageCategory,
};
