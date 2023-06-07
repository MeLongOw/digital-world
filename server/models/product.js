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
            required: true,
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
                variants: [{ variant: String, quantity: { type: Number } }],
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

productSchema.pre("save", function (next) {
    let totalQuantity = 0;
    for (const variant of this.variants) {
      if (variant.variants && variant.variants.length > 0) {
        for (const variantItem of variant.variants) {
          if (variantItem.quantity) {
            totalQuantity += variantItem.quantity;
          }
        }
      }
    }
    this.quantity = totalQuantity;
    next();
  });

//Export the model
module.exports = mongoose.model("Product", productSchema);
