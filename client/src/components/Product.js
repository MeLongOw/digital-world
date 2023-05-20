import React, { useEffect } from "react";
import { formatMoney } from "../utils/helpers";
import labelNew from "../assets/new.png";
import labelTrending from "../assets/trending.png";
import { renderStarFromNumber } from "../utils/helpers";
import SelectOption from "./SelectOption";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import path from "../utils/path";
import { apiAddWishList, apiAddToCart } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../store/user/asyncThunk";

const { BsFillCartFill, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew }) => {
    const dispatch = useDispatch()
    const token = useSelector((state) => state.user.token);
    const currentUser = useSelector((state) => state.user.current);
    // quantityInCart = currentUser?.cart.find((item)=>item._id===productData.)

    const handleAddWishList = async (wid) => {
        const response = await apiAddWishList(token, { wid });
        if(response?.success){
            dispatch(getCurrent(token))
        }
        return response?.success;
    };

    const handleAddToCart = async (pid) => {
        const response = await apiAddToCart(token, {
            pid,
            quantity: 1,
            color: productData?.color,
        });
        if(response?.success){
            dispatch(getCurrent(token))
        }
        return response?.success
    };

    return (
        <div className="w-full text-base px-[10px]">
            <div
                className="w-full border p-[15px] flex flex-col items-center group"
                to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
            >
                <div className="w-full relative overflow-hidden">
                    <div
                        className="absolute w-full bottom-0 flex justify-center invisible gap-4 group-hover:visible 
                        group-hover:animate-slide-top"
                    >
                        <SelectOption
                            icon={<BsFillCartFill />}
                            onClick={handleAddToCart}
                            productId={productData?._id}
                        />
                        <SelectOption
                            icon={<AiOutlineMenu />}
                            path={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
                        />
                        <SelectOption
                            icon={<BsFillSuitHeartFill />}
                            onClick={handleAddWishList}
                            productId={productData?._id}
                        />
                    </div>
                    <Link
                        to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
                        className="flex"
                    >
                        <img
                            src={
                                productData?.thumb ||
                                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                            }
                            alt=""
                            className="w-[274px] h-[274px] object-cover"
                        />
                        <img
                            src={isNew ? labelNew : labelTrending}
                            alt="label"
                            className="absolute top-0 right-[0px] w-[70px] h-[25px] object-contain"
                        />
                    </Link>
                </div>
                <div className="flex  flex-col gap-1 mt-[15px] items-start w-full">
                    <Link
                        to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
                        className="line-clamp-1 capitalize hover:text-main"
                    >
                        {productData?.title?.toLowerCase()}
                    </Link>
                    <span className="flex h-4">
                        {renderStarFromNumber(productData?.totalRatings)}
                    </span>
                    <span className="mb-4">
                        {formatMoney(productData?.price)} VNĐ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Product;
