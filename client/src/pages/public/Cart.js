import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { apiRemoveFromCart, apiUpdateCart } from "../../apis";
import { Button } from "../../components";
import { capitalize, formatMoney } from "../../utils/helpers";
import path from "../../utils/path";
import icons from "../../utils/icons";
import InputNumberCart from "../../components/InputNumberCart";
import { getCurrent } from "../../store/user/asyncThunk";

const { AiOutlineArrowRight } = icons;

const Cart = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const currentUser = useSelector((state) => state.user.current);
    const totalPrice = useMemo(() => {
        const arrPrice = currentUser?.cart?.map(
            (item) => item.product.price * item.quantity
        );
        const totalPrice = arrPrice?.reduce(
            (total, currentValue) => total + +currentValue,
            0
        );
        return totalPrice;
    }, [currentUser]);

    const fetchCurrent = () => {
        dispatch(getCurrent(token));
    };

    const handleRemoveFromCart = async (cid) => {
        const response = await apiRemoveFromCart(token, { cid });
        if (response.success) {
            fetchCurrent();
        }
    };

    const handleUpdateCart = async (pid, quantity) => {
        const response = await apiUpdateCart(token, { pid, quantity });
        console.log(response);
        if (response.success) {
            fetchCurrent();
        }
    };

    useEffect(() => {
        fetchCurrent();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="flex border p-5 text-lg text-gray-800 font-semibold">
                <div className="flex-6"></div>
                <div className="flex flex-4">
                    <div className="flex-1 text-center">QUANTITY</div>
                    <div className="flex-3 text-end">TOTAL</div>
                </div>
            </div>
            {currentUser?.cart?.map((item) => (
                <div className="border p-5 mt-[-1px] flex" key={item._id}>
                    <div className="flex flex-6 items-center">
                        <img
                            src={item.product.thumb}
                            alt=""
                            className="h-[214px] w-[214px] object-contain pr-5"
                        />
                        <div className="p-5 flex flex-col ">
                            <Link
                                to={`/${path.DETAIL_PRODUCT}/${item.product.slug}`}
                                className="font-base capitalize hover:text-main"
                            >
                                {item.product.title &&
                                    capitalize(item.product.title)}
                            </Link>
                            <span className="text-xs">
                                {item.product.color &&
                                    capitalize(item.product.color)}
                            </span>
                            <span
                                className="text-main hover:cursor-pointer mt-2 text-sm"
                                onClick={() => {
                                    handleRemoveFromCart(item._id);
                                }}
                            >
                                remove
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-4 items-center">
                        <div className="flex-1 flex justify-center">
                            <InputNumberCart
                                number={item.quantity}
                                handleUpdateCart={(quantity) => {
                                    handleUpdateCart(
                                        item.product._id,
                                        quantity
                                    );
                                }}
                            />
                        </div>
                        <div className="flex-3 flex justify-end text-lg text-gray-800 font-semibold">
                            {formatMoney(item.product.price)} VND
                        </div>
                    </div>
                </div>
            ))}

            <div className="border p-5 mb-10 mt-[-1px] flex flex-col items-end">
                <div className="flex items-center w-[40%] mb-[10px]">
                    <p className="flex-1 text-center text-sm text-gray-600">
                        Subtotal
                    </p>
                    <div className="flex-1 text-end text-xl text-gray-800 font-semibold line-clamp-2">
                        {formatMoney(totalPrice) || "0"} VND
                    </div>
                    <div></div>
                </div>
                <i className="text-sm text-gray-600 mb-[10px]">
                    Shipping, taxes, and discounts calculated at checkout.
                </i>
                <div className="w-[180px]">
                    <Button
                        name="CHECK OUT"
                        iconsAfter={<AiOutlineArrowRight />}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cart;
