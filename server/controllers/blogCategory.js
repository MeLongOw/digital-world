const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdBlogCategory: response ? response : response.errors,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select("title _id");
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : response.errors,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedBlogCategory: response
            ? response
            : response?.errors
            ? response.errors
            : "Not found this pcid in DB",
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(bcid);
    return res.status(200).json({
        success: response ? true : false,
        deletedBlogCategory: response
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
