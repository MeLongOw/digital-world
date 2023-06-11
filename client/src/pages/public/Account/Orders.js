import React, { useEffect, useState } from "react";
import { apiCancelOrder, apiUserOrders } from "../../../apis/order";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../utils/helpers";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import path from "../../../utils/path";
import Swal from "sweetalert2";
import { apiUpdateCart } from "../../../apis";
import Rating from "../../../components/Rating";
import { formatAddress } from "../../../utils/helpers";

const status = ["Processing", "Accepted", "Shipping", "Success", "Cancelled"];

const Orders = () => {
    const token = useSelector((state) => state.user.token);
    const [data, setData] = useState([]);
    const [statusSelected, setStatusSelected] = useState("Processing");
    const [viewDetail, setViewDetail] = useState([]);
    const navigate = useNavigate();
    const fetchUserOrders = async (statusSelected) => {
        const response = await apiUserOrders(token, { status: statusSelected });
        if (response?.success) {
            setData(response.userOrders);
        }
    };

    const viewDetailProducts = (oid) => {
        if (!viewDetail.some((el) => el === oid)) {
            setViewDetail((prev) => [...prev, oid]);
        } else {
            setViewDetail(viewDetail.filter((el) => el !== oid));
        }
    };

    const handleCancelOrder = async (oid) => {
        let isSuccess = false;
        await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel this order!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiCancelOrder(token, oid);
                if (response?.success) {
                    isSuccess = true;
                    await Swal.fire("Success!", response.mes, "success").then(
                        () => {
                            fetchUserOrders(statusSelected);
                        }
                    );
                } else {
                    isSuccess = true;
                    Swal.fire("error!", response.mes, "error");
                }
            } else {
                isSuccess = true;
            }
        });
        return isSuccess;
    };
    const handleEditOrder = async (cart) => {
        const updateCartPromises = cart.map((el) =>
            apiUpdateCart(token, {
                pid: el?.product._id,
                quantity: el.quantity,
                variant: el?.variant,
            })
        );
        await Promise.all(updateCartPromises);
        navigate(`/${path.CART}`);
    };

    useEffect(() => {
        fetchUserOrders(statusSelected);
        setViewDetail([]);
    }, [statusSelected]);
    return (
        <div>
            <h3 className="h-[48px] flex items-center font-semibold text-xl uppercase">
                Orders
            </h3>
            <div className="flex flex-col gap-4 pt-4 mb-5">
                <div className="text-lg font-semibold flex max-sm:flex-wrap gap-3 max-sm:text-sm">
                    {status.map((status, index) => (
                        <span
                            className={`hover:cursor-pointer ${
                                status === statusSelected && "text-main"
                            }`}
                            key={index}
                            onClick={() => setStatusSelected(status)}
                        >
                            {status}
                        </span>
                    ))}
                </div>
                {data.length ? (
                    data?.map((order) => (
                        <div
                            className="border w-full rounded-lg shadow-md flex flex-col p-3"
                            key={order?._id}
                        >
                            <div className="flex md:justify-between max-lg:flex-col ">
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <span className="font-semibold">{`OrderID: `}</span>
                                        <span>{order?._id}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{`Address: `}</span>
                                        <span>
                                            {formatAddress(order?.address)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{`Phone: `}</span>
                                        <span>{order?.phone}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{`Order Date: `}</span>
                                        <span>
                                            {moment(order?.createdAt).format(
                                                "HH:mm:ss DD/MM/YYYY"
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{`Status: `}</span>
                                        <span>{order?.status}</span>
                                    </div>

                                    {order?.coupon && (
                                        <div>
                                            <span className="font-semibold">{`Coupon: `}</span>
                                            <span>{order?.coupon?.title}</span>
                                            <span>{`(${order?.coupon?.discount}%)`}</span>
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-semibold">{`Total: `}</span>
                                        <span>{`${formatMoney(
                                            order?.total
                                        )} VND`}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{`Product Count: `}</span>
                                        <span>{order?.products?.length}</span>
                                    </div>
                                </div>
                                <div className="flex items-center max-md:mt-3 max-lg:justify-end">
                                    <span
                                        className="hover:text-main hover:cursor-pointer font-semibold"
                                        onClick={() =>
                                            viewDetailProducts(order?._id)
                                        }
                                    >
                                        {statusSelected === "Success"
                                            ? "Ratings"
                                            : "View detail"}
                                    </span>

                                    {statusSelected === "Processing" && (
                                        <span
                                            className="hover:text-main hover:cursor-pointer font-semibold border-l pl-3 ml-3 border-gray-500"
                                            onClick={() =>
                                                handleCancelOrder(order?._id)
                                            }
                                        >
                                            Cancel order
                                        </span>
                                    )}
                                    {statusSelected === "Cancelled" && (
                                        <Link
                                            className="hover:text-main hover:cursor-pointer font-semibold border-l pl-3 ml-3 border-gray-500"
                                            onClick={() =>
                                                handleEditOrder(order?.products)
                                            }
                                        >
                                            Edit order
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {viewDetail.some((el) => el === order?._id) &&
                                order?.products?.map((item) => (
                                    <div
                                        className={
                                            statusSelected === "Success" &&
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
                                            <span className="flex flex-col justify-center flex-1 pl-5 max-sm:pl-0 max-sm:text-center">
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
                                                                <span
                                                                    key={index}
                                                                >
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
                                        {statusSelected === "Success" && (
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
                                                    await fetchUserOrders(
                                                        statusSelected
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                    ))
                ) : (
                    <i>{`There is no order in "${statusSelected?.toLowerCase()}" yet`}</i>
                )}
            </div>
        </div>
    );
};

export default Orders;
