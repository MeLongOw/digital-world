import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import noDataImage from "../../assets/no-wishlist.png";
import { apiRemoveWishList } from "../../apis";
import { formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";
import { getCurrent } from "../../store/user/asyncThunk";

const { AiOutlineClose, AiOutlineLoading } = icons;

const WishList = () => {
    const { currentUser, token, isLoading } = useSelector(
        (state) => state.user
    );

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
    }, []);

    return (
        <div className="mb-10">
            <div className="flex gap-5 border p-5 font-sm text-gray-700 max-sm:gap-3">
                <div className="flex-2">IMAGES</div>
                <div className="flex-3">NAME</div>
                <div className="flex-2">PRICE</div>
                <div className="flex-1">REMOVE</div>
                <div className="flex-2">DETAIL</div>
            </div>
            {currentUser?.wishlist?.length ? (
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
                            <div className="flex-3 max-sm:text-sm">
                                {item.title}
                            </div>
                            <div className="flex-2 max-sm:text-sm">
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
                                className="flex-2 hover:text-main max-sm:text-sm"
                            >
                                View More
                            </Link>
                        </>
                    </div>
                ))
            ) : !isLoading ? (
                <div className="flex justify-center items-center gap-5 border border-t-0 p-5 font-sm text-gray-700">
                    <img
                        className="w-[200px] object-contain"
                        alt="no-data"
                        src={noDataImage}
                    />
                </div>
            ) : (
                <div className="flex w-full h-[50vh] justify-center items-center ml-[10px]">
                    <span className="flex items-center">
                        <AiOutlineLoading size={20} className="animate-spin" />
                    </span>
                    <span className="ml-3 text-lg">Loading wishlist...</span>
                </div>
            )}
        </div>
    );
};

export default WishList;
