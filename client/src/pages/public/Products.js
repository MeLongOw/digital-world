import React, { memo, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import { Product } from "../../components";
import Filter from "../../components/Filter";
import Pagination from "../../components/Pagination";
import SortBy from "../../components/SortBy";
import noProductFoundImg from "../../assets/no-product.jpg";

const Products = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [limitItem, setLimitItem] = useState(12);
    const [sort, setSort] = useState("-createdAt");
    const [priceFilter, setPriceFilter] = useState("");
    const [brandFilter, setbrandFilter] = useState("");

    
    const fetchProducts = async (page, limit, pathname, sort) => {
        const arrLocation = pathname.split("/");
        let category;
        if (arrLocation[1] === "products") {
            category = arrLocation[2];
        }

        const response = await apiGetProducts({
            sort,
            limit,
            page,
            category,
            price: priceFilter,
            brand: brandFilter,
        });
        if (response.success) {
            setProducts(response.products);
            setTotalItem(response.counts);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        for (const entry of searchParams.entries()) {
            const [param, value] = entry;
            if (param === "page") setCurrentPage(+value || 1);
            if (param === "limit") setLimitItem(+value || 12);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts(currentPage, limitItem, pathname, sort);
    }, [currentPage, limitItem, pathname, sort, priceFilter, brandFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort, priceFilter]);

    useEffect(() => {
        if (!totalItem) setCurrentPage(1);
    }, [totalItem]);

    return (
        <div>
            <div className="my-[15px] p-[10px] h-[108px] border flex items-center font-semibold text-sm text-gray-600">
                <div className="flex-4 flex flex-col">
                    <p className="mb-[10px]">Fillter by</p>
                    <Filter
                        setBrandFilter={setbrandFilter}
                        setPriceFilter={setPriceFilter}
                    />
                </div>
                <div className="flex-1 ">
                    <p className="mb-[10px]">Sort by</p>
                    <SortBy setValue={setSort} />
                </div>
            </div>

            <div className="flex flex-wrap mx-[-10px] ">
                {products?.length ? (
                    products?.map((data) => (
                        <div className="w-1/4 mb-5" key={data._id}>
                            <Product productData={data} />
                        </div>
                    ))
                ) : (
                    <div className="w-full flex justify-center items-center">
                        <img
                            className="w-[1000px] object-contain"
                            alt="no-product-found"
                            src={noProductFoundImg}
                        />
                    </div>
                )}
            </div>

            {!!products?.length && (
                <div className="my-10 flex justify-center">
                    <Pagination
                        totalItem={totalItem}
                        currentPage={currentPage}
                        limitItem={limitItem}
                        onChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(Products);
