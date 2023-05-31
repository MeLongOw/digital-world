const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: Array,
            required: true,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            require: true,
        },
        thumb: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductCategory",
            require: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: {
            type: Array,
        },
        variants: [
            {
                label: { type: String },
                variants: { type: Array },
            },
        ],
        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
                comment: { type: String },
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre("updateOne", function (next) {
    const update = this.getUpdate();
    if (update.images && update.images.length > 0 && !update.thumb) {
        update.thumb = update.images[0];
    }
    next();
});

//Export the model
module.exports = mongoose.model("Product", productSchema);
