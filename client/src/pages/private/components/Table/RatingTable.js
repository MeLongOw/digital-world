import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    apiGetProductRatings,
    apiDeleteProductRating,
    apiDeleteManyProductRatings,
} from "../../../../apis";
import SearchBox from "../SearchBox";
import DeleteButton from "../DeleteButton";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import RefreshButton from "../RefreshButton";
import Pagination from "../Pagination";
import { compareObjects } from "../../../../utils/helpers";

const selectSearchOptions = [
    { value: "title", label: "Product Title" },
    { value: "_id", label: "Product ID" },
    { value: "ratings", label: "Rating ID" },
    { value: "postedBy", label: "User ID" },
    { value: "star", label: "Star" },
];

export default function ProductTable() {
    const [data, setData] = useState(null);
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

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        const arr = [];
        for (const item of data) {
            arr.push(
                ...item?.ratings?.map((rating) => ({
                    pid: item._id,
                    rid: rating._id,
                }))
            );
        }
        setIsCheck(arr);
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClickCheckBox = ({ pid, rid }) => {
        if (isCheck.some((el) => compareObjects(el, { pid, rid }))) {
            setIsCheck(
                isCheck.filter((item) => item.pid !== pid && item.rid !== rid)
            );
        } else {
            setIsCheck([...isCheck, { pid, rid }]);
        }
    };

    const fetchProductRatings = async (query) => {
        let formatQuery;
        if (query?.title) formatQuery = { title: query.title };
        if (query?._id) formatQuery = { _id: query._id };
        if (query?.ratings) formatQuery = { ratings: { _id: query.ratings } };
        if (query?.star) formatQuery = { ratings: { star: +query.star } };
        if (query?.postedBy)
            formatQuery = { ratings: { postedBy: query.postedBy } };

        const response = await apiGetProductRatings(token, {
            sort: "-createdAt",
            limit: limitItem,
            page: currentPage,
            ...formatQuery,
        });
        if (response?.success) {
            setData(response.products);
            setTotalItem(response.counts);
        }

        return response?.success;
    };

    const handleDelete = async (pid, rid) => {
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
                const response = await apiDeleteProductRating(token, pid, {
                    rid,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        fetchProductRatings();
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
                const response = await apiDeleteManyProductRatings(token, {
                    _ids: isCheck,
                });
                if (response?.success) {
                    isSuccess = true;
                    Swal.fire("Success!", response.mes, "success").then(() => {
                        setIsCheck([]);
                        fetchProductRatings();
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
        fetchProductRatings();
    }, [currentPage, limitItem]);

    return (
        <div className="relative">
            {/* Action */}
            <div className="flex justify-between py-3">
                <SearchBox
                    fetch={fetchProductRatings}
                    options={selectSearchOptions}
                />
                <div className="flex items-center gap-4">
                    <DeleteButton
                        height="40px"
                        disabled={!isCheck?.length}
                        handleDelete={handleDeleteSelected}
                    />
                    <RefreshButton handleClick={fetchProductRatings} />
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
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    RID
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Product Title
                                </th>
                                <th
                                    scope="col"
                                    className="w-[15%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Comment
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Posted By
                                </th>
                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    Star
                                </th>
                                <th
                                    scope="col"
                                    className="w-[10%] px-3 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                >
                                    PID
                                </th>

                                <th
                                    scope="col"
                                    className="w-[5%] px-3 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {data?.map((item) =>
                                item?.ratings.map((rating) => (
                                    <tr className="" key={rating?._id}>
                                        <td className="py-3 pl-4">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="checkbox"
                                                    className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                                                    checked={isCheck.some(
                                                        (el) =>
                                                            el.pid ===
                                                                item?._id &&
                                                            el.rid ===
                                                                rating?._id
                                                    )}
                                                    onChange={() =>
                                                        handleClickCheckBox({
                                                            pid: item?._id,
                                                            rid: rating?._id,
                                                        })
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
                                            {rating?._id}
                                        </td>
                                        <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                            {item?.title}
                                        </td>
                                        <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                            {rating?.comment}
                                        </td>
                                        <td className="pl-3 py-4 text-sm text-gray-800 break-words flex flex-col">
                                            <span>{`${rating?.postedBy?.firstName} ${rating?.postedBy?.lastName}`}</span>
                                            <span>
                                                {`ID: ${rating?.postedBy?._id}`}
                                            </span>
                                        </td>
                                        <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                            {rating?.star}
                                        </td>
                                        <td className="pl-3 py-4 text-sm text-gray-800 break-words ">
                                            {item?._id}
                                        </td>
                                        <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap ">
                                            <div className="flex justify-end gap-2 items-center">
                                                <DeleteButton
                                                    handleDelete={() =>
                                                        handleDelete(
                                                            item._id,
                                                            rating._id
                                                        )
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
        </div>
    );
}
