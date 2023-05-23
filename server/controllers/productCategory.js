const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdProdCategory: response ? response : response.errors,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find();
    return res.status(200).json({
        success: response ? true : false,
        prodCategories: response ? response : response.errors,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
        new: true,
    });
    console.log(response)
    
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

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
