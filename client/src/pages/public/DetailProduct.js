import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import { apiAddToCart, apiGetProduct } from "../../apis";
import { Button } from "../../components";
import DetailDescription from "../../components/DetailDescription";
import InputNumberProduct from "../../components/InputNumberProduct";
import { getCurrent } from "../../store/user/asyncThunk";
import { formatMoney, renderStarFromNumber } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";

const {
    BsShieldShaded,
    MdLocalShipping,
    AiFillGift,
    TbTruckReturn,
    AiFillPhone,
    IoIosArrowRoundBack,
} = icons;

const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
};

const serviceBox = [
    {
        icon: <BsShieldShaded size={24} />,
        title: "Guarantee",
        content: "Quality Checked",
    },
    {
        icon: <MdLocalShipping size={24} />,
        title: "Free Shipping",
        content: "Free On All Products",
    },
    {
        icon: <AiFillGift size={24} />,
        title: "Special Gift Cards",
        content: "Special Gift Cards",
    },
    {
        icon: <TbTruckReturn size={24} />,
        title: "Free Return",
        content: "Within 7 Days",
    },
    {
        icon: <AiFillPhone size={24} />,
        title: "Consultancy",
        content: "Lifetime 24/7/365",
    },
];

const DetailProduct = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageActive, setImageActive] = useState("");
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token)

    const fetchProduct = async () => {
        const response = await apiGetProduct(slug);
        if (response?.success) {
            setProduct(response.product);
            setImageActive(response.product.thumb);
        }
    };

    const handleAddToCart = async (pid)=>{
        const response = await apiAddToCart(token, {
            pid,
            quantity: quantity,
            // color: productData?.color,
        });
        if(response?.success){
            dispatch(getCurrent(token))
        }
        return response?.success
    }

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="w-main">
            {product && (
                <>
                    <div className="flex mb-[50px]">
                        <div className=" flex-2">
                            <div className=" border mb-5">
                                <img
                                    className="w-[458px] h-[458px] object-contain "
                                    src={imageActive}
                                    alt=""
                                />
                            </div>

                            <div className="w-full flex">
                                <div className="w-full flex-grow-0">
                                    {/* <Slider {...settings}>
                                        {product?.images.map((link, index) => (
                                            <div
                                                key={index}
                                                className="w-[143px] h-[143px]"
                                            >
                                                <img
                                                    className="w-[143px] h-[143px] object-contain border"
                                                    src={link}
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </Slider> */}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-3">
                            <div className="flex-2 pl-[45px]">
                                <span className="text-[30px] font-semibold">
                                    {formatMoney(product?.price)} VNĐ
                                </span>
                                <span className="flex mt-3 mb-5">
                                    {renderStarFromNumber(
                                        product?.totalRatings,
                                        18
                                    )}
                                    <span className="pl-2 text-sm text-gray-600">
                                        {product?.ratings?.length
                                            ? `${product?.ratings?.length} reviews`
                                            : "0 review"}
                                    </span>
                                </span>
                                <ul className="text-sm text-gray-600 mb-5">
                                    {product?.description.map(
                                        (script, index) => (
                                            <li
                                                className="list-disc list-inside"
                                                key={index}
                                            >
                                                {script}
                                            </li>
                                        )
                                    )}
                                </ul>
                                <div className="flex items-center mb-3">
                                    <span className="w-[90px]">Internal</span>
                                    <div className="border text-center px-4 py-3">
                                        12GB
                                    </div>
                                </div>
                                <div className="flex items-center mb-3">
                                    <span className="w-[90px]">Color</span>
                                    <div className="border text-center px-4 py-3">
                                        Black
                                    </div>
                                </div>
                                <div className="flex items-center mb-3">
                                    <span className="w-[90px]">Quantity</span>
                                    <InputNumberProduct
                                        number={quantity}
                                        setNumber={setQuantity}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Button name="ADD TO CART" handleClick={()=>{handleAddToCart(product._id)}}/>
                                    
                                </div>
                            </div>
                            
                            <div className=" flex-1">
                                {serviceBox.map((box) => (
                                    <div key={box.title} className="flex border items-center p-[10px] mb-[10px]">
                                        <span className="mr-3 text-gray-700">
                                            {box.icon}
                                        </span>
                                        <span className="flex flex-col">
                                            <span className="text-[14px] text-gray-700">
                                                {box.title}
                                            </span>
                                            <span className="text-[12px] text-gray-500">
                                                {box.content}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/${path.HOME}`}
                        className="flex justify-center items-center text-sm text-gray-700 uppercase hover:text-main mb-[50px]"
                    >
                        <IoIosArrowRoundBack size={20} />
                        {`back to ${product?.category}`}
                    </Link>
                    <DetailDescription description={product?.description} />
                </>
            )}
        </div>
    );
};

export default DetailProduct;