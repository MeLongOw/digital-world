const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {

    const response = await Brand.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : "Can not create new brand",
    });
});

const getBrands = asyncHandler(async (req, res) => {
    if (req.query?.title) {
        const response = await Brand.find({
            title: {
                $regex: req.query.title,
                $options: "i",
            },
        }).populate('productCount');
        return res.status(200).json({
            success: response ? true : false,
            brands: response ? response : "Can not get brands",
        });
    } else {
        const response = await Brand.find().populate('productCount');
        return res.status(200).json({
            success: response ? true : false,
            brands: response ? response : "Can not get brands",
        });
    }
});

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : "Can not update brand",
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : "Can not delete brand",
    });
});

const deleteManyBrands = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    const deleteBrand = await Brand.deleteMany({ _id: { $in: _ids } });
    return res.status(200).json({
        success: deleteBrand ? true : false,
        deleteBrand: deleteBrand ? deleteBrand : "Can not delete brands",
    });
});

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    deleteManyBrands,
};
