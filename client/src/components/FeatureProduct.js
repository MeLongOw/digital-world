import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import path from "../utils/path";

const FeatureProduct = () => {
    const [products, setProducts] = useState(null);
    const fetchProducts = async () => {
        const response = await apiGetProducts({ limit: 9, totalRatings: 5 });
        if (response.success) setProducts(response.products);
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <div className="w-full">
            <h3 className="text-[20px] font-semibold border-b-2 uppercase border-main">
                Feature Product
            </h3>
            <div className="flex flex-wrap mt-5 md:[&>*:nth-child(3n)]:pr-0 max-md:[&>*:nth-child(2n)]:pr-0 max-sm:[&>*:nth-child(n)]:pr-0">
                {products?.map((item) => (
                    <ProductCard
                        key={item._id}
                        slug={item.slug}
                        image={item.thumb}
                        title={item.title}
                        totalRatings={item.totalRatings}
                        price={item.price}
                    />
                ))}
            </div>

            {/* section image */}
            <div className="flex justify-between max-md:flex-wrap">
                <Link to={`${path.PRODUCTS}`} className="flex md:flex-2 w-full">
                    <img
                        src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
                        alt=""
                        className="w-full object-cover pr-5 max-md:pr-0 max-md:pb-[10px] hover:animate-pulsate-fwd"
                    />
                </Link>
                <div className="flex md:flex-1 max-md:w-1/2 flex-col justify-between">
                    <Link
                        to={`${path.PRODUCTS}`}
                        className="flex justify-center"
                    >
                        <img
                            className="w-[100%] pb-[10px] max-md:pb-[5px] hover:animate-pulsate-fwd"
                            src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-bottom-home2_400x.jpg?v=1613166661"
                            alt=""
                        />
                    </Link>
                    <Link
                        to={`${path.PRODUCTS}`}
                        className="flex justify-center"
                    >
                        <img
                            className="w-[100%] pt-[10px] max-md:pt-[5px] hover:animate-pulsate-fwd"
                            src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner3-bottom-home2_400x.jpg?v=1613166661"
                            alt=""
                        />
                    </Link>
                </div>
                <Link
                    to={`${path.PRODUCTS}`}
                    className="flex md:flex-1 max-md:w-1/2"
                >
                    <img
                        src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
                        alt=""
                        className="w-full object-cover pl-5 max-md:pl-[10px] hover:animate-pulsate-fwd"
                    />
                </Link>
            </div>
        </div>
    );
};

export default FeatureProduct;
