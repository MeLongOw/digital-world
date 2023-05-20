import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import CustomSlider from "./CustomSlider";
import { getNewProducts } from "../store/product/asyncThunk";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import path from "../utils/path";

const tabs = [
    { id: 1, name: "best seller" },
    { id: 2, name: "new arrivals" },
];

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const [products, setProducts] = useState(null);
    const dispatch = useDispatch();
    const { newProducts } = useSelector((state) => state.products);

    const fetchProducts = async () => {
        const response = await apiGetProducts({ sort: "-sold" });
        if (response.success) {
            setBestSellers(response.products);
        }
    };

    useEffect(() => {
        fetchProducts();
        dispatch(getNewProducts());
    }, []);

    useEffect(() => {
        if (activeTab === 1) setProducts(bestSellers);
        if (activeTab === 2) setProducts(newProducts);
    }, [activeTab, bestSellers, newProducts]);

    return (
        <div>
            <div className="flex text-[20px] pb-4 border-b-2 border-main">
                {tabs.map((item) => (
                    <span
                        key={item.id}
                        className={`font-semibold cursor-pointer first:pl-0 border-r last:border-r-0 px-8 capitalize text-gray-400 ${
                            activeTab === item.id && "text-gray-900"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>
            <div className="mt-5 mx-[-10px]">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
            <div className="w-full flex gap-4 mt-5">
                <Link className="flex-1" to={`/${path.PRODUCTS}`}>
                    <img
                        className="w-full object-contain hover:animate-pulsate-fwd"
                        src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                        alt="banner"
                    />
                </Link>
                <Link className="flex-1" to={`/${path.PRODUCTS}`}>
                    <img
                        className="w-full object-contain hover:animate-pulsate-fwd"
                        src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                        alt="banner"
                    />
                </Link>
            </div>
        </div>
    );
};

export default BestSeller;
