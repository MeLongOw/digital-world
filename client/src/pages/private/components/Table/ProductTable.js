import React, { useEffect, useState } from "react";
import {
    apiGetProducts,
    apiDeleteProduct,
    apiAddProduct,
    apiEditProduct,
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
import { formatMoney } from "../../../../utils/helpers";
import TextArea from "../TextArea";

const defautPayload = {
    _id: "",
    title: "",
    price: "",
    brand: "",
    thumb: "",
    description: "",
    color: "",
    category: "",
};

export default function ProductTable() {
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [payload, setPayload] = useState(defautPayload);
    const token = useSelector((state) => state.user.token);

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    useEffect(() => {
        if (data?.length === isCheck?.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [isCheck, data]);
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

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: "-createdAt" });
        if (response?.success) {
            setData(response.products);
        }
        return response?.success;
    };

    const handleEdit = (product) => {
        console.log({ product });
        const {
            _id,
            title,
            price,
            brand,
            thumb,
            description,
            color,
            category,
        } = product;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload({
            _id,
            title,
            price,
            brand,
            thumb,
            description,
            color,
            category,
        });
    };

    const handleDelete = async (cid) => {
        let isSuccess = true;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteProduct(token, cid);
                if (response?.success) {
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchProducts();
                    });
                } else {
                    isSuccess = response?.success;
                    Swal.fire("error!", response.mes, "error");
                }
            } else {
                isSuccess = !result.isConfirmed;
            }
        });
        console.log({ isSuccess });
        return isSuccess;
    };

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setPayload(defautPayload);
    };

    const handleSubmitModal = async () => {
        const { _id, ...data } = payload;
        if (isEdit) {
            console.log({ payload });
            const response = await apiEditProduct(token, _id, data);
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchProducts();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        } else {
            console.log({ data });
            const response = await apiAddProduct(token, data);
            if (response?.success) {
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchProducts();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        }
        setIsModalOpen(false);
        setIsEdit(false);
        setPayload(defautPayload);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox />
                <div className="flex items-center">
                    <Button name="Add new" rounded handleClick={handleAddNew} />
                    <RefreshButton handleClick={fetchProducts} />
                </div>
            </div>

            {/* Table */}
            <div className="w-full inline-block align-middle">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full divide-y divide-gray-200 bg-white overflow-x-auto table-fixed">
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
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Title
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Brand
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Image
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Description
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Color
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="w-[4%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Rating
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Sold
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
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
                                        {formatMoney(item.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.brand}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        <img
                                            className="w-[100px] h-[100px] object-contain"
                                            src={item.thumb}
                                            alt=""
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        <ul className="flex flex-col">
                                            {item.description?.map((item) => (
                                                <li
                                                    className="list-disc list-inside text-xs"
                                                    key={item}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.color}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.totalRatings}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.sold}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        {item.quantity}
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
                    type="number"
                    title="Price"
                    nameKey="price"
                    value={payload.price}
                    setValue={setPayload}
                />
                <InputField
                    title="Brand"
                    nameKey="brand"
                    value={payload.brand}
                    setValue={setPayload}
                />
                <InputField
                    title="Thumb"
                    nameKey="thumb"
                    value={payload.thumb}
                    setValue={setPayload}
                />
                <TextArea
                    type=""
                    title="Description"
                    nameKey="description"
                    value={payload.description}
                    setValue={setPayload}
                />
                <InputField
                    title="Color"
                    nameKey="color"
                    value={payload.color}
                    setValue={setPayload}
                />
                <InputField
                    title="Category"
                    nameKey="category"
                    value={payload.category}
                    setValue={setPayload}
                />
            </Modal>
        </div>
    );
}
