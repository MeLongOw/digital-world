import React, { useEffect, useState } from "react";
import {
    apiGetBrands,
    apiDeleteBrand,
    apiAddBrand,
    apiEditBrand,
    apiDeleteManyBrands,
} from "../../../../apis";
import Button from "../../../../components/Button";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import InputField from "../../../../components/InputField";
import {
    apiAddCoupon,
    apiDeleteCoupon,
    apiDeleteManyCoupons,
    apiEditCoupon,
    apiGetCoupons,
} from "../../../../apis/coupon";
import moment from "moment";

const defautPayload = {
    _id: "",
    title: "",
    discount: '',
    expiry: "",
};

export default function CouponTable() {
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [payload, setPayload] = useState(defautPayload);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (data?.length === isCheck?.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [isCheck, data]);

    const setDefaultState = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setPayload(defautPayload);
    };

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(data.map((item) => item._id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
    const handleClickCheckBox = (id) => {
        if (isCheck.includes(id)) {
            setIsCheck(isCheck.filter((item) => item !== id));
        } else {
            setIsCheck([...isCheck, id]);
        }
    };

    const fetchCoupons = async (params) => {
        const response = await apiGetCoupons(params);

        if (response?.success) {
            setData(response.coupons);
        }

        return response?.success;
    };

    const handleEdit = (brand) => {
        const { _id, title, expiry, discount } = brand;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload({ _id, title, expiry: moment(expiry).format('HH:mm:ss DD/MM/YYYY'), discount });
    };

    const handleDelete = async (cid) => {
        let isSuccess = false;
        await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteCoupon(token, cid);
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchCoupons();
                    });
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

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleCancelModal = () => {
        setDefaultState();
    };

    const handleDeleteSelected = async () => {
        let isSuccess = false;
        await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteManyCoupons(token, {
                    _ids: isCheck,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        setIsCheck([]);
                        fetchCoupons();
                    });
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

    const handleSubmitModal = async () => {
        const { _id, ...data } = payload;
        if (isEdit) {
            const response = await apiEditCoupon(token, _id, data);
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchCoupons();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        } else {
            const response = await apiAddCoupon(token, data);
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchCoupons();
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
        fetchCoupons();
    }, []);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox isOption={false} fetch={fetchCoupons} />
                <div className="flex items-center gap-4">
                    <DeleteButton
                        height="40px"
                        disabled={!isCheck?.length}
                        handleDelete={handleDeleteSelected}
                    />
                    <Button name="Add new" rounded handleClick={handleAddNew} />
                    <RefreshButton handleClick={fetchCoupons} />
                </div>
            </div>

            {/* Table */}
            <div className="w-full inline-block align-middle">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full divide-y divide-gray-200 bg-white overflow-x-auto table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-[5%] py-3 pl-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="checkbox-all"
                                            type="checkbox"
                                            className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                                            onChange={handleSelectAll}
                                            checked={isCheckAll}
                                        />
                                        <label
                                            htmlFor="checkbox"
                                            className="sr-only"
                                        >
                                            Checkbox
                                        </label>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    title
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    discount(%)
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Expiry
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {data?.map((item) => (
                                <tr className="" key={item._id}>
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                                                checked={isCheck.includes(
                                                    item._id
                                                )}
                                                onChange={() =>
                                                    handleClickCheckBox(
                                                        item._id
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor="checkbox"
                                                className="sr-only"
                                            >
                                                Checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800 break-words">
                                        {item._id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        {item.title}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        {item?.discount}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        {moment(item?.expiry).format(
                                            "HH:mm:ss DD/MM/YYYY"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap ">
                                        <div className="flex justify-end gap-2 items-center">
                                            <EditButton
                                                handleEdit={() =>
                                                    handleEdit(item)
                                                }
                                            />
                                            <DeleteButton
                                                handleDelete={() =>
                                                    handleDelete(item._id)
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

            {/* modal */}
            <Modal
                isModalOpen={isModalOpen}
                isEdit={isEdit}
                handleCancel={handleCancelModal}
                handleSubmit={handleSubmitModal}
            >
                <InputField
                    title="Title"
                    nameKey="title"
                    value={payload.title}
                    setValue={setPayload}
                />
                <InputField
                    title="Discount(%)"
                    type="number"
                    nameKey="discount"
                    value={payload.discount}
                    setValue={setPayload}
                />
                <InputField
                    title="Expiry(HH:mm:ss DD/MM/YYYY)"
                    nameKey="expiry"
                    value={payload.expiry}
                    setValue={setPayload}
                />
            </Modal>
        </div>
    );
}
