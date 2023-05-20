const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category)
        throw new Error("title, description, category is required");
    const response = await Blog.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : "Can not create new blog",
    });
});

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : "Can not get blogs",
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing input(s)");
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : "Can not update blog",
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing input(s)");
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find(
        (uid) => uid.toString() === _id
    );

    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { dislikes: _id },
            },
            { new: true }
        );
        // return res.status(200).json({
        //     success: response ? true : false,
        //     rs: response,
        // });
    }

    const alreadyLiked = blog?.likes?.find((uid) => uid.toString() === _id);

    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $push: { likes: _id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error("Missing input(s)");
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.likes?.find((uid) => uid.toString() === _id);

    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
            },
            { new: true }
        );
        // return res.status(200).json({
        //     success: response ? true : false,
        //     rs: response,
        // });
    }

    const alreadyDisliked = blog?.dislikes?.find(
        (uid) => uid.toString() === _id
    );

    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { dislikes: _id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $push: { dislikes: _id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: response ? true : false,
            rs: response,
        });
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(
        bid,
        { $inc: { numberViews: 1 } },
        { new: true }
    )
        .populate("likes", "firstName, lastName")
        .populate("dislikes", "firstName, lastName");
    return res.status(200).json({
        success: response ? true : false,
        rs: response,
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deletedBlog: response,
    });
});

const uploadImageBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error("Missing input(s)");
    const response = await Blog.findByIdAndUpdate(bid, {
        $push: { images: req.file.path},
    }, {new: true});
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : "Can not upload images ",
    });
});

module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    getBlog,
    likeBlog,
    dislikeBlog,
    deleteBlog,
    uploadImageBlog
};
