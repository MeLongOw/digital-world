import React, { useEffect, useState } from "react";
import { apiUserOrders } from "../../../apis/order";
import { useSelector } from "react-redux";
import { formatMoney, renderStarFromNumber } from "../../../utils/helpers";
import moment from "moment";
import { Link } from "react-router-dom";
import path from "../../../utils/path";
import Rating from "../../../components/Rating";
import icons from "../../../utils/icons";

const { AiOutlineLoading } = icons;

const Ratings = () => {
    const { token, isLoading } = useSelector((state) => state.user);
    const [data, setData] = useState([]);
    const [editRatings, setEditRatings] = useState([]);
    const fetchUserOrders = async () => {
        const response = await apiUserOrders(token, { status: "Success" });
        if (response?.success) {
            setData(response.userOrders);
        }
    };

    const handleEditRating = (id) => {
        setEditRatings((prev) => {
            if (prev.some((el) => el === id))
                return prev.filter((el) => el !== id);
            else return [...prev, id];
        });
    };

    useEffect(() => {
        fetchUserOrders();
        setEditRatings([]);
    }, []);
    return (
        <div>
            <h3 className="h-[48px] flex items-center font-semibold text-xl uppercase">
                Ratings
            </h3>
            <div className="flex flex-col gap-4 pt-4 mb-5">
                {data.length ? (
                    data?.map((order) => (
                        <div
                            className="border w-full rounded-lg shadow-md flex flex-col p-3"
                            key={order?._id}
                        >
                            {order?.products?.map((item) => (
                                <div
                                    className={
                                        "border border-gray-500 p-3 rounded-lg mb-4"
                                    }
                                    key={`${item._id}`}
                                >
                                    <div className="flex mb-3 mt-3 max-sm:flex-col max-sm:items-center">
                                        <div className="w-[76px] aspect-square relative">
                                            <img
                                                alt="product"
                                                src={item?.product?.thumb}
                                                className="rounded-xl border border-gray-400"
                                            />
                                            <div className="bg-gray-600 text-white w-[24px] h-[24px] absolute top-[-8px] right-[-8px] rounded-full flex justify-center items-center">
                                                {item?.quantity}
                                            </div>
                                        </div>
                                        <span className="flex flex-col justify-center flex-1 pl-5 max-sm:text-center max-sm:pl-0">
                                            <Link
                                                className="text-base text-gray-900 mb-2 font-semibold hover:text-main max-sm:mb-0"
                                                to={`/${path.PRODUCTS}/${item?.product?.slug}`}
                                            >
                                                {item?.product?.title}
                                            </Link>
                                            <span className="text-sm text-gray-700">
                                                {item.variant?.map(
                                                    (vari, index) => {
                                                        return (
                                                            <span key={index}>
                                                                {index !==
                                                                    0 && (
                                                                    <span className="p-1">
                                                                        /
                                                                    </span>
                                                                )}
                                                                <span>
                                                                    {
                                                                        vari?.variant
                                                                    }
                                                                </span>
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </span>
                                        </span>
                                        <span className="pl-5 flex justify-center items-center text-base font-medium text-gray-900 max-sm:pl-0">
                                            <span>
                                                {formatMoney(
                                                    item?.product?.price
                                                )}{" "}
                                                VND
                                            </span>
                                        </span>
                                    </div>
                                    {!editRatings.some(
                                        (el) => el === item?._id
                                    ) ? (
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex">
                                                    {renderStarFromNumber(
                                                        item?.product
                                                            ?.ratings[0]?.star
                                                    )}
                                                </span>
                                                <i>
                                                    {moment(
                                                        item?.product
                                                            ?.ratings[0]
                                                            ?.createdAt
                                                    ).format(
                                                        "HH:mm:ss DD/MM/YYYY"
                                                    )}
                                                </i>
                                                <span>
                                                    {
                                                        item?.product
                                                            ?.ratings[0]
                                                            ?.comment
                                                    }
                                                </span>
                                            </div>
                                            <span
                                                className="flex ml-5 font-semibold hover:cursor-pointer"
                                                onClick={() =>
                                                    handleEditRating(item?._id)
                                                }
                                            >
                                                Edit
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <Rating
                                                starStore={
                                                    item?.product?.ratings[0]
                                                        ?.star
                                                }
                                                commentStore={
                                                    item?.product?.ratings[0]
                                                        ?.comment
                                                }
                                                pid={item?.product?._id}
                                                oid={order?._id}
                                                token={token}
                                                fetch={async () =>
                                                    await fetchUserOrders()
                                                }
                                            />
                                            <i
                                                className="flex justify-center underline text-gray-400 hover:cursor-pointer mt-3"
                                                onClick={() =>
                                                    handleEditRating(item?._id)
                                                }
                                            >
                                                Click to cancel
                                            </i>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))
                ) : !isLoading ? (
                    <i>There is no rating yet</i>
                ) : (
                    <div className="flex w-full h-[50vh] justify-center items-center ml-[10px]">
                        <span className="flex items-center">
                            <AiOutlineLoading
                                size={20}
                                className="animate-spin"
                            />
                        </span>
                        <span className="ml-3 text-lg">
                            Loading ratings...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ratings;
