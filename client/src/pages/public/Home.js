import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
    Sidebar,
    Banner,
    BestSeller,
    DealDaily,
    FeatureProduct,
    CustomSlider,
} from "../../components";
import icons from "../../utils/icons";
import path from "../../utils/path";

const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
};

const logo = [
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-1_large_large_768f374b-12c0-4dd0-b9ef-7585f08cdc38_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-2_large_large_1c0f984f-9760-4b73-866e-10b9d225d851_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-4_large_large_f4d00a02-3fbf-4bf1-81a6-daec160e076f_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-5_large_large_2629fcad-3956-4ce9-9265-c2e31d94a8c5_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-6_large_large_e49d4a97-fd54-48c7-9865-8fc912607190_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-7_large_large_de3782ee-9ae1-44b9-b73f-0a77d9c266ee_160x160.png?v=1613166661",
    "https://cdn.shopify.com/s/files/1/1903/4853/files/logo-3_large_large_64561f36-72d3-4858-9199-b22f31a90dc2_160x160.png?v=1613166661",
];

const { IoIosArrowForward } = icons;

const Home = () => {
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="w-main flex">
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 w-[75%] pl-5 flex-auto">
                    <Banner />
                    <BestSeller />
                </div>
            </div>

            <div className="my-8">
                <FeatureProduct />
            </div>

            <div className="my-8">
                <h3 className="text-[20px] font-semibold border-b-2 uppercase border-main mb-5">
                    New arrivals
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider products={newProducts} />
                </div>
            </div>

            <div className="my-8">
                <h3 className="text-[20px] font-semibold border-b-2 uppercase border-main mb-5">
                    Hot collections
                </h3>
                <div className="w-full mt-4 flex flex-wrap [&>*:nth-child(4n)]:pr-0">
                    {categories?.map((item) => (
                        <div
                            className="w-1/4 max-w-[25%] flex flex-initial pr-5 pb-5"
                            key={item._id}
                        >
                            <div className=" border flex w-full min-h-[200px] p-4">
                                <Link
                                    className="flex flex-1 justify-center"
                                    to={`/${
                                        path.PRODUCTS
                                    }/${item?.title?.toLowerCase()}`}
                                >
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="w-[120px] h-[120px] object-contain "
                                    />
                                </Link>
                                <div className="text-gray-700 flex-1 pl-5">
                                    <Link
                                        className="font-semibold uppercase hover:text-main"
                                        to={`/${
                                            path.PRODUCTS
                                        }/${item?.title?.toLowerCase()}`}
                                    >
                                        {item.title}
                                    </Link>
                                    <ul className="text-sm">
                                        {item.brand
                                            .map((item) => item)
                                            ?.sort((a, b) => {
                                                if (
                                                    a?.productCount >
                                                    b?.productCount
                                                ) {
                                                    return -1;
                                                }
                                                if (
                                                    a?.productCount <
                                                    b?.productCount
                                                ) {
                                                    return 1;
                                                }
                                                return 0;
                                            })
                                            ?.map((brand, index) => {
                                                if (index < 7) {
                                                    return (
                                                        <Link
                                                            state={brand?.title}
                                                            to={`/${
                                                                path.PRODUCTS
                                                            }/${item?.title?.toLowerCase()}`}
                                                            key={brand?._id}
                                                            className="flex items-center hover:text-main text-gray-500"
                                                        >
                                                            <IoIosArrowForward
                                                                size={14}
                                                            />
                                                            <p>
                                                                {brand?.title}
                                                            </p>
                                                        </Link>
                                                    );
                                                } else return null;
                                            })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col items-center">
                <div className="w-main h-[90px] flex justify-between items-center mb-8">
                    <div className="w-full">
                        <Slider className="custom-slider" {...settings}>
                            {logo.map((item, index) => (
                                <img
                                    src={item}
                                    key={index}
                                    alt=""
                                    className="w-[160px] h-[60px] object-contain"
                                />
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
