const User = require("../models/user");
const Product = require("../models/product");

const asyncHandler = require("express-async-handler");
const {
    generateAccessToken,
    generateRefreshToken,
    generateRegisterToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const { arraysEqual } = require("../utils/helper");

const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName || !phone)
        return res.status(400).json({
            success: false,
            mes: "Missing input(s)",
        });

    const existedUsers = await Promise.all([
        User.findOne({ email }),
        User.findOne({ phone }),
    ]);
    if (existedUsers[0]) {
        throw new Error("Email is existed!");
    } else if (existedUsers[1]) {
        throw new Error("Phone is existed!");
    } else {
        const registerToken = generateRegisterToken(
            email,
            password,
            firstName,
            lastName,
            phone
        );

        const html = `Click on the link below to complete your registration.
        <a href=${process.env.URL_SERVER}/api/user/authregister/${registerToken}>Click Here</a>.
        This link will be expired after 15 minutes`;
        sendMail({
            email,
            html,
            subject: "Complete registration on Digital World",
        });

        return res.status(200).json({
            success: true,
            mes: "Please check your email to active your account",
        });
    }
});

const authRegister = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { email, password, firstName, lastName, phone } = jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decode) => {
            if (err) {
                return res.redirect(
                    `${process.env.CLIENT_URL}/authregister/failed`
                );
            } else {
                return decode;
            }
        }
    );

    const newUser = await User.create({
        email,
        password,
        phone,
        firstName,
        lastName,
    });
    if (newUser) {
        return res.redirect(`${process.env.CLIENT_URL}/authregister/success`);
    } else {
        return res.redirect(`${process.env.CLIENT_URL}/authregister/failed}`);
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: "Missing input(s)",
        });
    const response = await User.findOne({ email });
    if (response && (await response.isCorrectPassword(password))) {
        const { password, role, refreshToken, ...userData } = response;
        const accessToken = generateAccessToken(response._id, role);
        const newRefreshToken = generateRefreshToken(response._id);
        await User.findByIdAndUpdate(
            response._id,
            { refreshToken: newRefreshToken, accessToken: accessToken },
            { new: true }
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById({ _id })
        .select("-password -refreshToken -role")
        .populate("wishlist cart.product");
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : "User is not found",
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie || !cookie.refreshToken)
        throw new Error("Not found refresh token");

    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({
        _id: rs._id,
        refreshToken: cookie.refreshToken,
    });
    const newAccessToken = generateAccessToken(response._id, response.role);
    response.accessToken = newAccessToken;
    await response.save();

    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? newAccessToken
            : "Refresh token not found in DB",
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
        throw new Error("Not found refresh token");
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: "" },
        { new: true }
    );

    res.clearCookie("refreshToken", { httpOnly: true });
    res.status(200).json({
        success: true,
        mes: "Logout completed",
    });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new Error("Missing email");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const resetToken = user.createPasswordChangedToken();
    await user.save();

    const html = `Click on the link below to change your password. <a href=${process.env.CLIENT_URL}/resetpassword/${resetToken}>Click Here</a>. This link will be expired after 15 minutes`;
    const data = {
        email,
        html,
        subject: "Forgot password",
    };
    const rs = sendMail(data);
    return res.status(200).json({
        success: true,
        rs,
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) throw new Error("Missing Input(s)");
    const passwordResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid reset token");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? "Updated password" : "Something went wrong",
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstName, lastName, phone, password } = req.body;
    if (!_id || !Object.keys(req.body).length)
        throw new Error("Missing inputs");

    const response = await User.findByIdAndUpdate(
        _id,
        { firstName, lastName, phone, password },
        {
            new: true,
        }
    ).select("-password -role");
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response
            ? response
            : "can not updated! please check and try again",
    });
});

// [ADMIN]
const getUsers = asyncHandler(async (req, res) => {
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
    if (queries?.firstName)
        formattedQueries.firstName = {
            $regex: queries.firstName,
            $options: "i",
        };
    if (queries?.lastName)
        formattedQueries.lastName = {
            $regex: queries.lastName,
            $options: "i",
        };
    if (queries?.email)
        formattedQueries.email = {
            $regex: queries.email,
            $options: "i",
        };
    if (queries?.phone)
        formattedQueries.phone = {
            $regex: queries.phone,
            $options: "i",
        };
    let queryCommand = User.find(formattedQueries);
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
    //Execute query
    queryCommand
        .skip(skip)
        .limit(limit)
        .select("-password -refreshToken -role")
        .exec()
        .then(async (response) => {
            const counts = await User.find(formattedQueries).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                users: response ? response : "Can not get products.",
            });
        });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    if (!_id) throw new Error("Missing inputs");
    const deletedUser = await User.findByIdAndDelete(_id);
    return res.status(200).json({
        success: deletedUser ? true : false,
        deletedUser: deletedUser
            ? `User with email ${deletedUser.email} has already deleted`
            : "No user deteled",
    });
});

const deleteManyUsers = asyncHandler(async (req, res) => {
    const { _ids } = req.body;
    const deletedUser = await User.deleteMany({ _id: { $in: _ids } });
    return res.status(200).json({
        success: deletedUser ? true : false,
        deletedUser: deletedUser ? deletedUser : "Can not delete users",
    });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!Object.keys(req.body).length) throw new Error("Missing input(s)");
    const response = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select("-password -refreshToken -role");
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "no user updated",
    });
});

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error("Missing input(s)");
    const response = await User.findByIdAndUpdate(
        _id,
        { address: req.body.address },
        {
            new: true,
        }
    ).select("-password -refreshToken -role");
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "no user address updated",
    });
});

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, variant } = req.body;
    if (!pid || !quantity) throw new Error("Missing input(s)");
    let variantNoId;
    if (!variant?.length) {
        const product = await Product.findById(pid).select("variants");
        const defautVariant = product.variants?.map(({ label, variants }) => ({
            label,
            variant: variants[0].variant,
        }));
        variantNoId = defautVariant;
    } else {
        variantNoId = variant.map(({ label, variant }) => ({
            label,
            variant,
        }));
    }

    const user = await User.findById(_id).select("cart").populate("cart");

    const alreadyProductVariantInCart = user?.cart?.find((item) => {
        return (
            item.product.toString() === pid &&
            arraysEqual(
                variantNoId,
                item.variant.map(({ label, variant }) => ({
                    label,
                    variant,
                }))
            )
        );
    });

    if (alreadyProductVariantInCart) {
        const response = await User.updateOne(
            { cart: { $elemMatch: alreadyProductVariantInCart } },
            { $set: { "cart.$.quantity": quantity } },
            {
                new: true,
            }
        );
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong",
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    cart: { product: pid, quantity, variant: variantNoId },
                },
            },
            { new: true }
        );
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong",
        });
    }
});
const clearCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cids } = req.body;
    const user = await User.findByIdAndUpdate(_id, {
        $pull: { cart: { _id: { $in: cids } } },
    });

    return res.status(200).json({
        success: user ? true : false,
    });
});

const removeFormCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (user?.cart?.find((el) => el._id.toString() === req.body.cid)) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { cart: { _id: req.body.cid } } },
            {
                new: true,
            }
        ).select("-password -refreshToken -role");
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong",
        });
    } else {
        throw new Error("do not found this cart id");
    }
});

const updateWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user?.wishlist?.find((el) => el.toString() === req.body.wid)) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: req.body.wid } },
            {
                new: true,
            }
        ).select("-password -refreshToken -role");
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong",
        });
    } else {
        return res.status(200).json({
            success: true,
            user,
        });
    }
});

const removeWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (user?.wishlist?.find((el) => el.toString() === req.body.wid)) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: req.body.wid } },
            {
                new: true,
            }
        ).select("-password -refreshToken -role");
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : "Something went wrong",
        });
    } else {
        throw new Error("do not found this item on wishlist");
    }
});

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    clearCart,
    removeFormCart,
    authRegister,
    updateWishList,
    removeWishList,
    deleteManyUsers,
};
