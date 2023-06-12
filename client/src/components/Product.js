import React, { useEffect } from "react";
import { formatMoney } from "../utils/helpers";
import labelNew from "../assets/new.png";
import labelTrending from "../assets/trending.png";
import { renderStarFromNumber } from "../utils/helpers";
import SelectOption from "./SelectOption";
import icons from "../utils/icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import path from "../utils/path";
import { apiAddWishList, apiAddToCart } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../store/user/asyncThunk";
import Swal from "sweetalert2";

const { BsFillCartFill, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew, isHasLabel = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const checkIsLoggedIn = async () => {
        if (!isLoggedIn) {
            await Swal.fire({
                title: "Please login!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Go login",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            });
        }
    };

    const handleAddWishList = async (wid) => {
        await checkIsLoggedIn();
        const response = await apiAddWishList(token, { wid });
        if (response?.success) {
            dispatch(getCurrent(token));
        }
        return response?.success;
    };

    const handleAddToCart = async (pid) => {
        await checkIsLoggedIn();
        const response = await apiAddToCart(token, {
            pid,
            quantity: 1,
        });
        if (response?.success) {
            dispatch(getCurrent(token));
        }
        return response?.success;
    };

    return (
        <div className="w-full text-base px-[10px]">
            <div
                className="w-full border p-[15px] flex flex-col items-center group"
                to={`/${path.DETAIL_PRODUCT}/${productData?.slug}`}
            >
                <div className="w-full relative overflow-hidden">
                    <div
                        className="absolute w-full bottom-0 flex justify-center lg:invisible gap-4 lg:group-hover:visible 
                        lg:group-hover:animate-slide-top"
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
                        className="flex justify-center"
                    >
                        <img
                            src={
                                productData?.thumb ||
                                "https://comm.uir.ac.id/wp-content/uploads/2022/09/no-image-found.b1edc35f0fa6.png"
                            }
                            alt=""
                            className="max-w-[274px] w-full aspect-square object-contain max-lg:w-[200]"
                        />
                        {isHasLabel && (
                            <img
                                src={isNew ? labelNew : labelTrending}
                                alt="label"
                                className="absolute top-0 right-[0px] w-[70px] h-[25px] object-contain"
                            />
                        )}
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
