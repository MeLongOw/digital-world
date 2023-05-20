const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");
const data = require("../../data/data2.json");
const categoryData = require("../../data/cate_brand");
const slugify = require("slugify");

const fn = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + "_" + Math.round(Math.random() * 100000),
        description: product?.description,
        brand: product?.brand,
        thumb: product?.thumb,
        price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find((item) => item.label === "Color")
            ?.variants[0],
        totalRatings: Math.ceil(Math.random() * 5),
    });
};

const insertProduct = asyncHandler(async (req, res) => {
    const promises = [];
    for (let product of data) promises.push(fn(product));
    await Promise.all(promises);

    return res.status(200).json({
        success: true,
    });
});

const fn2 = async (category) => {
    await ProductCategory.create({
        title: category?.cate,
        brand: category?.brand,
        image: category?.image,
    });
};

const insertCategory = asyncHandler(async (req, res) => {
    const promises = [];
    for (let productCategory of categoryData)
        promises.push(fn2(productCategory));
    await Promise.all(promises);

    return res.status(200).json({
        success: true,
    });
});

module.exports = {
    insertProduct,
    insertCategory,
};
