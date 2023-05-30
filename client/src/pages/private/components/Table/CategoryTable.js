import React, { useEffect, useState } from "react";
import {
    apiGetCategories,
    apiDeleteCategory,
    apiAddCategory,
    apiEditCategory,
    apiDeleteManyCategories,
    apiGetBrands,
    apiUpdateImageCategory,
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
import InputSelect from "../../../../components/InputSelect";
import InputFile from "../../../../components/InputFile";
import Pagination from "../Pagination";
import { useSearchParams } from "react-router-dom";

const defautPayload = {
    _id: "",
    title: "",
    brand: [],
    selectedFiles: [],
    variants: [{ label: "", variants: [""] }],
};

export default function CategoryTable() {
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [payload, setPayload] = useState(defautPayload);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [brands, setBrands] = useState([]);

    const token = useSelector((state) => state.user.token);


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

    const fetchCategories = async (param) => {
        const response = await apiGetCategories(param);
        if (response?.success) {
            setData(response.prodCategories);
        }
        return response?.success;
    };

    const fetchBrand = async () => {
        const response = await apiGetBrands();
        if (response?.success) {
            const arrBrands = response?.brands?.map((item) => ({
                value: item._id,
                label: item.title,
            }));
            setBrands(arrBrands);
        }
        return response?.success;
    };

    const handleEdit = (item) => {
        const { _id, title, brand } = item;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload((prev) => ({
            ...prev,
            _id,
            title,
            brand,
            brandSelectDefault: brand?.map((item) => ({
                value: item._id,
                label: item.title,
            })),
        }));
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
                const response = await apiDeleteCategory(token, cid);
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchCategories();
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

    const handleSubmitModal = async () => {
        const { _id, selectedFiles, ...data } = payload;
        const handleUpdateImageCategory = async (_id) => {
            const uploaders = selectedFiles?.map((file) => {
                const formData = new FormData();
                formData.append("image", file);
                return apiUpdateImageCategory(token, _id, formData);
            });

            await Promise.all(uploaders);
        };

        //Create Colection
        if (isEdit) {
            const response = await apiEditCategory(token, _id, data);
            if (response?.success) {
                await handleUpdateImageCategory(_id);

                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchCategories();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        } else {
            const response = await apiAddCategory(token, data);
            if (response?.success) {
                await handleUpdateImageCategory(
                    response.createdProdCategory._id
                );

                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchCategories();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        }

        setDefaultState();

        //trigger stop loading
        return true;
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
                const response = await apiDeleteManyCategories(token, {
                    _ids: isCheck,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        setIsCheck([]);
                        fetchCategories();
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

    useEffect(() => {
        if (data?.length === isCheck?.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [isCheck, data]);

    useEffect(() => {
        fetchCategories();
        fetchBrand();
    }, []);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox isOption={false} fetch={fetchCategories} />
                <div className="flex items-center gap-4">
                    <DeleteButton
                        height="40px"
                        disabled={!isCheck?.length}
                        handleDelete={handleDeleteSelected}
                    />
                    <Button name="Add new" rounded handleClick={handleAddNew} />
                    <RefreshButton handleClick={fetchCategories} />
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
                                    className="w-[20%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    title
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    brand
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Image
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Count
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
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
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words ">
                                        <div className="flex flex-wrap">
                                            {item?.brand?.map((brand) => (
                                                <div
                                                    className="border mr-2 my-2 p-2"
                                                    key={brand?.title}
                                                >
                                                    {brand?.title}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        <img
                                            className="w-[100px] h-[100px] object-contain"
                                            src={item.image}
                                            alt=""
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 break-words">
                                        {item?.productCount}
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
                <InputSelect
                    title="Brand"
                    defaultValue={payload?.brandSelectDefault}
                    nameKey="brand"
                    value={payload.brand}
                    setValue={setPayload}
                    selectOptions={brands}
                />
                <InputFile
                    type="file"
                    title="Image"
                    nameKey="selectedFiles"
                    value={payload.uploader}
                    setValue={setPayload}
                />
            </Modal>
        </div>
    );
}
