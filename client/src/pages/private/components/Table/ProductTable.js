import React, { useEffect, useState } from "react";
import {
    apiGetProducts,
    apiDeleteProduct,
    apiAddProduct,
    apiEditProduct,
    apiDeleteManyProducts,
    apiGetBrands,
    apiGetCategories,
    apiUpdateImageProduct,
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
import { formatMoney, reducedArray } from "../../../../utils/helpers";
import InputSelect from "../../../../components/InputSelect";
import InputDynamic from "../../../../components/InputDynamic";
import InputFieldValue from "../../../../components/InputVariants";
import { useSearchParams } from "react-router-dom";
import Pagination from "../Pagination";
import InputFile from "../../../../components/InputFile";

const defautPayload = {
    _id: "",
    title: "",
    price: "",
    brand: "",
    thumb: "",
    selectedFiles: [],
    description: [""],
    variants: [{ label: "", variants: [{ variant: "", quantity: "" }] }],
    category: "",
};

const selectSearchOptions = [
    { value: "title", label: "Title" },
    { value: "brand", label: "Brand" },
    { value: "category", label: "Category" },
];

export default function ProductTable() {
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [payload, setPayload] = useState(defautPayload);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

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

    const fetchProducts = async (query) => {
        const response = await apiGetProducts({
            sort: "-createdAt",
            limit: limitItem,
            page: currentPage,
            ...query,
        });
        if (response?.success) {
            setData(response.products);
            setTotalItem(response.counts);
        }

        return response?.success;
    };

    const fetchBrands = async (query) => {
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

    const fetchCategories = async (query) => {
        const response = await apiGetCategories();
        if (response?.success) {
            const arrProdCategories = response?.prodCategories?.map((item) => ({
                value: item._id,
                label: item.title,
            }));
            setCategories(arrProdCategories);
        }
        return response?.success;
    };

    const handleEdit = (product) => {
        const { brand, category, images, ...data } = product;
        setIsModalOpen(true);
        setIsEdit(true);
        setPayload((prev) => ({
            ...prev,
            ...data,
            images: [...images],
            brand,
            brandSelectDefault: {
                value: brand._id,
                label: brand.title,
            },
            category,
            categorySelectDefault: {
                value: category._id,
                label: category.title,
            },
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
                const response = await apiDeleteProduct(token, cid);
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchProducts();
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
                const response = await apiDeleteManyProducts(token, {
                    _ids: isCheck,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        setIsCheck([]);
                        fetchProducts();
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
        payload.variants = reducedArray(payload.variants);
        const { _id, selectedFiles, ...data } = payload;

        const handleUpdateImagesProduct = async (_id) => {
            const uploaders = selectedFiles?.map((file) => {
                const formData = new FormData();
                formData.append("image", file);
                return apiUpdateImageProduct(token, _id, formData);
            });
            await Promise.all(uploaders);
        };

        if (isEdit) {
            const response = await apiEditProduct(token, _id, data);
            if (response?.success) {
                await handleUpdateImagesProduct(_id);
                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchProducts();
                });
            } else {
                Swal.fire("error!", response.mes, "error");
            }
        } else {
            const response = await apiAddProduct(token, data);
            if (response?.success) {
                await handleUpdateImagesProduct(response?.createdProduct._id);

                Swal.fire("Success!", response.mes, "success").then(() => {
                    fetchProducts();
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
        fetchBrands();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, limitItem]);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox
                    fetch={fetchProducts}
                    options={selectSearchOptions}
                />
                <div className="flex items-center gap-4">
                    <DeleteButton
                        height="40px"
                        disabled={!isCheck?.length}
                        handleDelete={handleDeleteSelected}
                    />
                    <Button name="Add new" rounded handleClick={handleAddNew} />
                    <RefreshButton handleClick={fetchProducts} />
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
                                    Title
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Price
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Brand
                                </th>
                                <th
                                    scope="col"
                                    className="w-[8%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Images
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Description
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Variants
                                </th>
                                <th
                                    scope="col"
                                    className="w-[7%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="w-[4%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Rating
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Sold
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Quantity
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
                                        {item.title}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        {formatMoney(item.price)}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item?.brand?.title}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        <img
                                            className="w-[100px] h-[100px] object-contain"
                                            src={item.thumb}
                                            alt=""
                                        />
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words">
                                        <ul className="flex flex-col">
                                            {item.description?.map((item) => (
                                                <li
                                                    className="list-disc list-outside text-xs"
                                                    key={item}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        <ul>
                                            {item?.variants?.map(
                                                (variant, index) => (
                                                    <li
                                                        className="list-disc list-outside text-xs"
                                                        key={index}
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {`${variant.label}`}
                                                        </span>
                                                        <span>
                                                            {`: ${variant.variants
                                                                .map(
                                                                    (el) =>
                                                                        el.variant +
                                                                        `(${el.quantity})`
                                                                )
                                                                .join(" / ")}`}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item.category?.title}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item.totalRatings}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item.sold}
                                    </td>
                                    <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                        {item.quantity}
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
                <InputSelect
                    isMulti={false}
                    title="Brand"
                    defaultValue={payload.brandSelectDefault}
                    nameKey="brand"
                    setValue={setPayload}
                    selectOptions={brands}
                />
                <InputSelect
                    isMulti={false}
                    title="Category"
                    defaultValue={payload?.categorySelectDefault}
                    nameKey="category"
                    setValue={setPayload}
                    selectOptions={categories}
                />
                <InputFile
                    multiple={true}
                    type="file"
                    title="Images"
                    images={payload?.images}
                    nameKey="selectedFiles"
                    setValue={setPayload}
                />
                <InputDynamic
                    type=""
                    title="Description"
                    nameKey="description"
                    value={payload.description}
                    setValue={setPayload}
                />
                <InputFieldValue
                    title="Variants"
                    nameKey="variants"
                    value={payload.variants}
                    setValue={setPayload}
                />
            </Modal>
        </div>
    );
}
