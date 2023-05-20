const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            unique: true,
        },
        numberViews: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        image: {
            type: String,
            default:
                "https://www.dashlane.com/blog/_next/image?url=%2Fblog%2Fimages%2Fblog-header.png&w=3840&q=100",
        },
        author: {
            type: String,
            default: "Admin",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//Export the model
module.exports = mongoose.model("Blog", userSchema);
