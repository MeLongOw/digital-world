import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetProducts } from "../apis/product";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import icons from "../utils/icons";
import path from "../utils/path";
import CountDown from "./CountDown";

const { AiFillStar, AiOutlineMenu, AiOutlineLoading } = icons;
const DealDaily = () => {
    const [dailydeal, setDailydeal] = useState(null);
    const fetchDailydeal = async () => {
        const response = await apiGetProducts({
            limit: 1,
            page: Math.round(Math.random() * 5),
            totalRatings: 5,
        });
        if (response.success) setDailydeal(response.products[0]);
    };
    useEffect(() => {
        fetchDailydeal();
    }, []);
    return (
        <div className="w-full border flex-auto flex flex-col pb-4">
            <h3 className="flex items-center justify-between p-4 text-xl">
                <span className="flex-1 flex justify-center text-red-600">
                    <AiFillStar size={28} />
                </span>
                <span className="flex-8 font-semibold flex justify-center uppercase">
                    Daily deals
                </span>
                <span className="flex-1"></span>
            </h3>
            {dailydeal ? (
                <>
                    <div className="w-full flex flex-col items-center pt-8 gap-2">
                        <Link to={`${path.DETAIL_PRODUCT}/${dailydeal?.slug}`}>
                            <img
                                src={
                                    dailydeal?.thumb ||
                                    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                                }
                                alt=""
                                className="w-full object-contain"
                            />
                        </Link>
                        <Link to={`${path.DETAIL_PRODUCT}/${dailydeal?._id}`} className="line-clamp-1 text-center hover:text-main">
                            {dailydeal?.title}
                        </Link>
                        <span className="flex h-4">
                            {renderStarFromNumber(dailydeal?.totalRatings, 20)}
                        </span>
                        <span>{formatMoney(dailydeal?.price)} VNĐ</span>
                    </div>
                    <div className="px-4 mt-4 m">
                        <div className="mb-4">
                            <CountDown action={fetchDailydeal} />
                        </div>
                        <Link
                            to={`${path.DETAIL_PRODUCT}/${dailydeal?._id}`}
                            className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 transition-colors text-white font-medium p-2 cursor-pointer"
                        >
                            <AiOutlineMenu />
                            <span>Options</span>
                        </Link>
                    </div>
                </>
            ) : (
                <span className="flex w-full flex-1 items-center justify-center "> <AiOutlineLoading className="animate-spin mr-2"/> Daily deal is loading...</span>
            )}
        </div>
    );
};

export default DealDaily;
