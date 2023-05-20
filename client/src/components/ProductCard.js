import React from "react";
import { Link } from "react-router-dom";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import path from "../utils/path";

const ProductCard = ({ slug, price, title, image, totalRatings }) => {
    return (
        <div className="w-1/3 flex pb-5 pr-5 ">
            <div className="flex w-full border ">
                <Link
                    to={`/${path.DETAIL_PRODUCT}/${slug}`}
                    className="flex flex-shrink-0 w-[122px] h-[122px]"
                >
                    <img
                        src={
                            image ||
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                        }
                        alt="products"
                        className="w-full object-contain p-4"
                    />
                </Link>
                <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
                    <Link
                        to={`${path.DETAIL_PRODUCT}/${slug}`}
                        className="line-clamp-1 capitalize text-sm hover:text-main"
                    >
                        {title?.toLowerCase()}
                    </Link>
                    <span className="flex h-4">
                        {renderStarFromNumber(totalRatings, 14)}
                    </span>
                    <span>{formatMoney(price)} VNĐ</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
