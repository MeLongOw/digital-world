import React, { memo, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import { Product } from "../../components";
import Pagination from "../../components/Pagination";
import SortBy from "../../components/SortBy";
import icons from "../../utils/icons";

const { RiArrowDropDownLine } = icons;

const Products = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [limitItem, setLimitItem] = useState(12);

    const fetchProducts = async (page, limit) => {
        const arrLocation = pathname.split("/");
        let category;
        if (arrLocation[1] === "products") {
            category = arrLocation[2];
        }

        const response = await apiGetProducts({
            sort: "-createdAt",
            limit,
            page,
            category,
        });
        if (response.success) {
            setProducts(response.products);
            setTotalItem(response.counts);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        for (const entry of searchParams.entries()) {
            const [param, value] = entry;
            if (param === "page") setCurrentPage(+value || 1);
            if (param === "limit") setLimitItem(+value || 12);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts(currentPage, limitItem);
    }, [currentPage, limitItem]);

    useEffect(() => {
        if (!totalItem) setCurrentPage(1);
    }, [totalItem]);

    return (
        <div>
            <div className="my-[15px] p-[10px] h-[108px] border flex items-center font-semibold text-sm text-gray-600">
                <div className="flex-4 flex flex-col ">
                    <p className="mb-[10px]">Fillter by</p>
                    <div className="pl-5 pr-3 flex border h-[45px] flex-grow-0 mr-[5px] items-center justify-between">
                        <span>Price</span>
                        <span>
                            <RiArrowDropDownLine />
                        </span>
                    </div>
                </div>
                <div className="flex-1 ">
                    <p className="mb-[10px]">Sort by</p>
                    <SortBy />
                </div>
            </div>
            <div className="flex flex-wrap mx-[-10px] ">
                {products?.map((data) => (
                    <div className="w-1/4 mb-5" key={data._id}>
                        <Product productData={data} />
                    </div>
                ))}
            </div>
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
};

export default memo(Products);
