import React, { useEffect, useState } from "react";
import {
    apiEditUser,
    apiGetOrders,
    apiUpdateStatusOrder,
} from "../../../../apis";
import SearchBox from "../SearchBox";

import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import InputSelect from "../../../../components/InputSelect";
import moment from "moment";
import { formatAddress } from "../../../../utils/helpers";

const defautPayload = { _id: "", status: "" };

const selectSearchOptions = [
    { value: "coupon", label: "Coupon" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "status", label: "Status" },
];

const statusSelect = [
    { value: "Processing", label: "Processing" },
    { value: "Shipping", label: "Shipping" },
    { value: "Success", label: "Success" },
    { value: "Returning", label: "Returning" },
    { value: "Cancelled", label: "Cancelled" },
];

export default function OrderTable() {
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [payload, setPayload] = useState(defautPayload);
    const token = useSelector((state) => state.user.token);

    //PAGINATION
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [limitItem, setLimitItem] = useState(20);
    useEffect(() => {
        for (const entry of searchParams.entries()) {
            const [param, value] = entry;
            if (param === "page") setCurrentPage(+value || 1);
            if (param === "limit") setLimitItem(+value || 20);
        }
    }, [searchParams]);

    const setDefaultState = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setPayload(defautPayload);
    };

    const fetchOrders = async (query) => {
        const response = await apiGetOrders(token, {
            sort: "-createdAt",
            limit: limitItem,
            page: currentPage,
            ...query,
        });
        console.log(response);
        if (response?.success) {
            setData(response.orders);
            setTotalItem(response?.counts);
        }

        return response?.success;
    };

    const handleEdit = (order) => {
        console.log(order);
        const { status } = order;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload({
            _id: order?._id,
            status: { value: status, label: status },
        });
    };

    const handleCancelModal = () => {
        setDefaultState();
    };

    const handleSubmitModal = async () => {
        const { _id, status } = payload;
        if (isEdit) {
            const response = await apiUpdateStatusOrder(token, _id, {
                status,
            });
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchOrders();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        }
        setDefaultState();

        //trigger stop loading
        return true;
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, limitItem]);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox fetch={fetchOrders} options={selectSearchOptions} />
                <div className="flex items-center gap-4">
                    <RefreshButton handleClick={fetchOrders} />
                </div>
            </div>

            {/* Table */}
            <div className="w-full inline-block align-middle">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full divide-y divide-gray-200 bg-white overflow-x-auto table-fixed overflow-y-scroll">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Order By
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Coupon
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Products
                                </th>
                                <th
                                    scope="col"
                                    className="w-[12%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    address
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Created at
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-right text-gray-500 uppercase"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {data?.map((item) => (
                                <tr className="" key={item._id}>
                                    <td className="pl-3 py-4 text-sm font-medium text-gray-800 break-words">
                                        {item._id}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        <div className="flex flex-col">
                                            <span>
                                                {item?.orderBy?.firstName}{" "}
                                                {item?.orderBy?.lastName}
                                            </span>
                                            <span>{item?.orderBy?.email}</span>
                                            <span>{item?.orderBy?.phone}</span>
                                        </div>
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {item.coupon
                                            ? `${item?.coupon?.title} (${item?.coupon?.discount}%)`
                                            : "None"}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item?.status}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item?.products.map((el) => (
                                            <div
                                                className="flex gap-2"
                                                key={el?._id}
                                            >
                                                <span className="font-semibold">
                                                    [{el.quantity}]
                                                </span>
                                                <span>{`${
                                                    el.product?.title
                                                } -- ${el?.variant
                                                    .map(
                                                        ({ variant }) => variant
                                                    )
                                                    .join(" / ")}`}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {formatAddress(item?.address)}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {moment(item?.createdAt).format(
                                            "HH:mm:ss DD/MM/YYYY"
                                        )}
                                    </td>
                                    <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap ">
                                        <div className="flex justify-end gap-2 items-center">
                                            <EditButton
                                                handleEdit={() =>
                                                    handleEdit(item)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="my-10 flex justify-center">
                <Pagination
                    totalItem={totalItem}
                    currentPage={currentPage}
                    limitItem={limitItem}
                    onChange={setCurrentPage}
                />
            </div>

            {/* modal */}
            <Modal
                isModalOpen={isModalOpen}
                isEdit={isEdit}
                handleCancel={handleCancelModal}
                handleSubmit={handleSubmitModal}
            >
                <InputSelect
                    isMulti={false}
                    title="Status"
                    defaultValue={payload?.status}
                    nameKey="status"
                    setValue={setPayload}
                    selectOptions={statusSelect}
                />
            </Modal>
        </div>
    );
}
