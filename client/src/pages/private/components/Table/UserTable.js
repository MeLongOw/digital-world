import React, { useEffect, useState } from "react";
import {
    apiDeleteManyUsers,
    apiGetUsers,
    apiEditUser,
    apideleteUser,
} from "../../../../apis";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import EditButton from "../EditButton";
import Modal from "../Modal";
import InputField from "../../../../components/InputField";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import { formatAddress } from "../../../../utils/helpers";

const defautPayload = {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    isBlocked: "",
};

const selectSearchOptions = [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "isBlocked", label: "Blocked" },
];

export default function UserTable() {
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

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

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
        setIsCheck(data?.map((item) => item._id));
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

    const fetchUsers = async (query) => {
        const response = await apiGetUsers(token, {
            sort: "-createdAt",
            limit: limitItem,
            page: currentPage,
            ...query,
        });
        if (response?.success) {
            setData(response.users);
            setTotalItem(response?.counts);
        }

        return response?.success;
    };

    const handleEdit = (user) => {
        const { firstName, lastName, email, phone, isBlocked, _id } = user;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload({
            _id,
            firstName,
            lastName,
            email,
            phone,
            isBlocked: Number(isBlocked),
        });
    };

    const handleDelete = async (id) => {
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
                const response = await apideleteUser(token, id);
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchUsers();
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
                const response = await apiDeleteManyUsers(token, {
                    _ids: isCheck,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        setIsCheck([]);
                        fetchUsers();
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

    const handleCancelModal = () => {
        setDefaultState();
    };

    const handleSubmitModal = async () => {
        const { _id, ...data } = payload;

        if (isEdit) {
            const response = await apiEditUser(token, _id, data);
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchUsers();
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
        fetchUsers();
    }, [currentPage, limitItem]);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox fetch={fetchUsers} options={selectSearchOptions} />
                <div className="flex items-center gap-4">
                    <DeleteButton
                        height="40px"
                        disabled={!isCheck?.length}
                        handleDelete={handleDeleteSelected}
                    />
                    <RefreshButton handleClick={fetchUsers} />
                </div>
            </div>

            {/* Table */}
            <div className="w-full inline-block align-middle">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full divide-y divide-gray-200 bg-white overflow-x-auto table-fixed overflow-y-scroll">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-[2%] py-3 pl-4">
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
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    First Name
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Last Name
                                </th>
                                <th
                                    scope="col"
                                    className="w-[12%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Phone
                                </th>
                                <th
                                    scope="col"
                                    className="w-[12%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Address
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    IsBLocked
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-right text-gray-500 uppercase "
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
                                    <td className="pl-3 py-4 text-sm font-medium text-gray-800 break-words">
                                        {item._id}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {item.firstName}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {item.lastName}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item?.email}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {item?.phone}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {formatAddress(item?.address)}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {Number(item?.isBlocked)}
                                    </td>

                                    <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap ">
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
                <InputField
                    title="First Name"
                    nameKey="firstName"
                    value={payload.firstName}
                    setValue={setPayload}
                />
                <InputField
                    title="Last Name"
                    nameKey="lastName"
                    value={payload.lastName}
                    setValue={setPayload}
                />
                <InputField
                    title="Email"
                    nameKey="email"
                    value={payload.email}
                    setValue={setPayload}
                />
                <InputField
                    type="number"
                    title="Phone"
                    nameKey="phone"
                    value={payload.phone}
                    setValue={setPayload}
                />
                <InputField
                    type="number"
                    title="IsBlocked"
                    nameKey="isBlocked"
                    value={payload.isBlocked}
                    setValue={setPayload}
                />
            </Modal>
        </div>
    );
}
