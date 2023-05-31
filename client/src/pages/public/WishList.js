import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import noDataImage from "../../assets/no-wishlist.png";
import { apiRemoveWishList } from "../../apis";
import { formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";
import { getCurrent } from "../../store/user/asyncThunk";

const { AiOutlineClose } = icons;

const WishList = () => {
    const currentUser = useSelector((state) => state.user.current);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const FetchCurrentUser = async () => {
        dispatch(getCurrent(token));
    };

    const handleRemoveWishList = async (wid) => {
        const response = await apiRemoveWishList(token, { wid });

        if (response?.success) {
            FetchCurrentUser();
        }
    };

    useEffect(() => {
        FetchCurrentUser();
    }, [token]);

    return (
        <div>
            <div className="flex gap-5 border p-5 font-sm text-gray-700">
                <div className="flex-2">IMAGES</div>
                <div className="flex-3">NAME</div>
                <div className="flex-2">PRICE</div>
                <div className="flex-1">REMOVE</div>
                <div className="flex-2">DETAIL</div>
            </div>
            {currentUser?.wishlist.length ? (
                currentUser?.wishlist?.map((item) => (
                    <div
                        key={item?._id}
                        className="flex gap-5 border border-t-0 p-5 font-sm items-center text-gray-700"
                    >
                        <>
                            <div className="flex-2 flex justify-center">
                                <img
                                    src={item.thumb}
                                    className="w-[213px] h-[213px] object-contain"
                                    alt=""
                                />
                            </div>
                            <div className="flex-3 hover:text-main">
                                {item.title}
                            </div>
                            <div className="flex-2 hover:text-main">
                                {formatMoney(item.price)} VND
                            </div>
                            <div className="flex-1 hover:text-main hover:cursor-pointer">
                                <AiOutlineClose
                                    onClick={() =>
                                        handleRemoveWishList(item._id)
                                    }
                                />
                            </div>
                            <Link
                                to={`/${path.DETAIL_PRODUCT}/${item.slug}`}
                                className="flex-2 hover:text-main"
                            >
                                View More
                            </Link>
                        </>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center gap-5 border border-t-0 p-5 font-sm items-center text-gray-700 mb-10">
                    <img
                        className="w-[200px] object-contain"
                        alt="no-data"
                        src={noDataImage}
                    />
                </div>
            )}
        </div>
    );
};

export default WishList;
