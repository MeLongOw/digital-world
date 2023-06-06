import React, { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiRemoveFromCart, apiUpdateCart } from "../apis";
import { appSlice } from "../store/app/appSlice";
import { getCurrent } from "../store/user/asyncThunk";
import { capitalize, formatMoney } from "../utils/helpers";
import icons from "../utils/icons";
import Button from "./Button";
import InputNumberCart from "./InputNumberCart";
import path from "../utils/path";

const { AiOutlineClose, AiOutlineArrowRight } = icons;

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user.token);
    const currentUser = useSelector((state) => state.user.current);

    const totalPrice = useMemo(() => {
        const arrPrice = currentUser?.cart?.map(
            (item) => item.product?.price * item.quantity
        );
        const totalPrice = arrPrice?.reduce(
            (total, currentValue) => total + +currentValue,
            0
        );
        return totalPrice;
    }, [currentUser]);

    const fetchCurrent = async () => {
        dispatch(getCurrent(token));
    };

    const handleRemoveFromCart = async (cid) => {
        const response = await apiRemoveFromCart(token, { cid });
        if (response.success) {
            fetchCurrent();
        }
    };

    const handleUpdateCart = async (pid, quantity, variant) => {
        const response = await apiUpdateCart(token, { pid, quantity, variant });
        if (response.success) {
            fetchCurrent();
        }
    };

    const handleToDetailProduct = () => {
        dispatch(appSlice.actions.toggleCart());
        window.scrollTo({
            top: 0,
        });
    };

    
    useEffect(() => {
        fetchCurrent();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchCurrent();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col px-[30px] text-white">
            <div className="h-[80px] p-[10px] flex justify-between border-b-2 border-gray-700">
                <div className="text-lg flex items-center">YOUR CART</div>
                <div className="flex items-center ">
                    <AiOutlineClose
                        size={18}
                        className="hover:cursor-pointer hover:text-main "
                        onClick={() => {
                            dispatch(appSlice.actions.toggleCart());
                        }}
                    />
                </div>
            </div>
            <div className="flex-1 h-auto overflow-hidden overflow-y-auto pt-[30px] text-sm">
                {currentUser?.cart?.map((item) => (
                    <div
                        key={item._id}
                        className="pb-5 mb-5 border-gray-700 border-b flex relative"
                    >
                        <img
                            src={item.product?.thumb}
                            alt=""
                            className="w-[80px] h-[80px] object-contain"
                        />
                        <div className="pl-5 flex-1 flex flex-col justify-between">
                            <div className="flex justify-between mb-[10px]">
                                <div className="flex flex-col">
                                    <Link
                                        className="hover:text-main mb-1"
                                        onClick={handleToDetailProduct}
                                        to={`/${path.DETAIL_PRODUCT}/${item?.product?.slug}`}
                                    >
                                        {item.product?.title &&
                                            capitalize(item.product?.title)}
                                    </Link>
                                    <span className="flex">
                                        {item?.variant?.map((el, index) => {
                                            return (
                                                <span key={index}>
                                                    {index !== 0 && (
                                                        <span className="p-1">
                                                            /
                                                        </span>
                                                    )}
                                                    <span>{el?.variant}</span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <AiOutlineClose
                                        size={18}
                                        className="hover:cursor-pointer hover:text-main"
                                        onClick={() => {
                                            handleRemoveFromCart(item._id);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <InputNumberCart
                                        number={item.quantity}
                                        handleUpdateCart={(quantity) => {
                                            handleUpdateCart(
                                                item.product._id,
                                                quantity,
                                                item.variant
                                            );
                                        }}
                                    />
                                </div>
                                <span className="flex-1 text-right">
                                    {formatMoney(item.product?.price)} VND
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-sm pt-4 pb-8 border-t-2 border-gray-700">
                <div className="flex justify-between font-semibold mb-[10px]">
                    <span>SUBTOTAL</span>
                    <span>{formatMoney(totalPrice) || "0"} VND</span>
                </div>
                <i className="text-gray-300 flex text-center mb-[10px]">
                    Shipping, taxes, and discounts calculated at checkout.
                </i>
                <div className="mb-[10px]">
                    <Button
                        iconsAfter={<AiOutlineArrowRight size={16} />}
                        name={"SHOPPING CART"}
                        handleClick={() => {
                            navigate("/cart");
                            dispatch(appSlice.actions.toggleCart());
                        }}
                    />
                </div>
                <Button
                    iconsAfter={<AiOutlineArrowRight size={16} />}
                    name={"CHECK OUT"}
                    handleClick={() => {
                        if (currentUser?.cart?.length) {
                            navigate(`/${path.CHECKOUT}`);
                            dispatch(appSlice.actions.toggleCart());
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default memo(Cart);
