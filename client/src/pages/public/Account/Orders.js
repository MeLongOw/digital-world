import React, { useEffect, useState } from "react";
import { apiUserOrders } from "../../../apis/order";
import { useSelector } from "react-redux";
import { formatMoney } from "../../../utils/helpers";
import moment from "moment";

const status = ["Processing", "Success", "Cancelled"];

const Orders = () => {
    const token = useSelector((state) => state.user.token);
    const [data, setData] = useState([]);
    const [statusSelected, setStatusSelected] = useState("Processing");
    const [viewDetail, setViewDetail] = useState([]);
    console.log({ viewDetail });
    const fetchUserOrders = async (statusSelected) => {
        const response = await apiUserOrders(token, { status: statusSelected });
        if (response?.success) {
            setData(response.userOrders);
            console.log(response.userOrders);
        }
    };

    const viewDetailProducts = (oid) => {
        if (!viewDetail.some((el) => el === oid)) {
            setViewDetail((prev) => [...prev, oid]);
        } else {
            setViewDetail(viewDetail.filter((el) => el !== oid));
        }
    };

    useEffect(() => {
        fetchUserOrders(statusSelected);
    }, [statusSelected]);
    return (
        <div>
            <h3 className="h-[48px] flex items-center font-semibold text-xl uppercase">
                Orders
            </h3>
            <div className="flex flex-col gap-3 pt-4 mb-5">
                <div className="text-lg font-semibold flex gap-3">
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
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <span className="font-semibold">{`OrderID: `}</span>
                                        <span>{order?._id}</span>
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
                                <div className="flex items-center">
                                    <span
                                        className="hover:text-main hover:cursor-pointer font-semibold"
                                        onClick={() =>
                                            viewDetailProducts(order?._id)
                                        }
                                    >
                                        View detail
                                    </span>
                                </div>
                            </div>
                            {viewDetail.some((el) => el === order?._id) &&
                                order?.products?.map((item) => (
                                    <div
                                        className="flex mb-3 mt-3"
                                        key={`${item._id}`}
                                    >
                                        <div className="w-[76px] aspect-square relative">
                                            <img
                                                alt="product"
                                                src={item?.product?.thumb}
                                                className="rounded-xl border border-gray-400"
                                            />
                                            <div className="bg-gray-600 text-white w-[24px] h-[24px] absolute top-[-8px] right-[-8px] rounded-full flex justify-center items-center">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <span className="flex flex-col justify-center flex-1 pl-5">
                                            <span className="text-base text-gray-900 mb-2 font-semibold">
                                                {item.product.title}
                                            </span>
                                            <span className="text-sm text-gray-700">
                                                {item.variant.map(
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
                                        <span className="pl-5 flex justify-center items-center text-base font-medium text-gray-900">
                                            {formatMoney(item.product.price)}{" "}
                                            VND
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ))
                ) : (
                    <i>There is no order yet</i>
                )}
            </div>
        </div>
    );
};

export default Orders;
