import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    apiClearCart,
    apiCreateOrder,
    apiGetCoupons,
    apiUpdateUserAddress,
    apiUpdateUserInformation,
} from "../../apis";
import { Button, InputField } from "../../components";
import { getCurrent } from "../../store/user/asyncThunk";
import { compareObjects, formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";
import path from "../../utils/path";

const { IoIosArrowRoundBack, CiDiscount1 } = icons;

const defaultAdress = { address: "", ward: "", district: "", city: "" };

const Checkout = () => {
    const { state } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.current);
    const token = useSelector((state) => state.user.token);
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState("");
    const [address, setAddress] = useState(defaultAdress);
    const [phone, setPhone] = useState("");
    const [isDisableButtonSave, setIsDisableButtonSave] = useState(false);
    const [isDisableButtonOrder, setisDisableButtonOrder] = useState(true);

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleUpdatePhone = async () => {
        await apiUpdateUserInformation(token, { phone });
    };

    const handleSaveAddress = async () => {
        if (!isDisableButtonSave) {
            const response = await apiUpdateUserAddress(token, {
                address: JSON.stringify(address),
            });
            dispatch(getCurrent(token));
            if (response?.success) setIsDisableButtonSave(true);
        }
        return true;
    };

    const handleSubmitOrder = async () => {
        let isSuccess = false;
        if (state?.selectedProducts && state?.selectedProducts?.length) {
            await Swal.fire({
                title: "Confirm your order?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await apiCreateOrder(token, {
                        products: state?.selectedProducts,
                        coupon: selectedCoupon?._id,
                        address: JSON.stringify(address),
                        phone,
                    });
                    if (response?.success) {
                        await Swal.fire(
                            "Success!",
                            response.mes,
                            "success"
                        ).then(async () => {
                            const response = await apiClearCart(token, {
                                cids: state?.selectedProducts.map(
                                    (el) => el._id
                                ),
                            });
                            if (response?.success) {
                                dispatch(getCurrent(token));
                                navigate("/");
                            }
                            isSuccess = true;
                        });
                    } else {
                        isSuccess = true;
                        Swal.fire("error!", response.mes, "error");
                    }
                } else {
                    isSuccess = true;
                }
            });
        } else {
            isSuccess = true;
        }
        return isSuccess;
    };

    const fetchCoupon = async () => {
        const response = await apiGetCoupons();
        if (response?.success) setCoupons(response?.coupons);
    };
    const subTotal = useMemo(() => {
        return (
            state?.selectedProducts?.reduce(
                (total, item) => (total += +item?.product.price),
                0
            ) || 0
        );
    }, [state]);

    const handleSelectCoupon = (coupon) => {
        setSelectedCoupon(coupon);
    };

    useEffect(() => {
        setSelectedCoupon(coupons[0]);
    }, [coupons]);

    useEffect(() => {
        if (
            isDisableButtonSave &&
            !compareObjects(address, defaultAdress) &&
            state?.selectedProducts?.length
        ) {
            setisDisableButtonOrder(false);
        } else {
            setisDisableButtonOrder(true);
        }
    }, [isDisableButtonSave, address, state]);

    useEffect(() => {
        if (currentUser?.address) {
            if (compareObjects(JSON.parse(currentUser?.address), address)) {
                setIsDisableButtonSave(true);
            } else {
                setIsDisableButtonSave(false);
            }
        }
    }, [address, currentUser?.address]);

    useEffect(() => {
        if (currentUser?.phone) setPhone(currentUser?.phone);
        if (currentUser?.address) setAddress(JSON.parse(currentUser?.address));
    }, [currentUser]);

    useEffect(() => {
        fetchCoupon();
    }, []);

    return (
        <div className="flex mb-10">
            <div className="flex-1 border p-[32px]">
                <h3 className="text-xl font-semibold mb-3">Contact</h3>
                <div className="flex flex-col font-medium gap-3 mb-3">
                    <span className="">{`${currentUser?.firstName} (${currentUser?.email})`}</span>
                    <div className="">
                        <span className="">Phone: </span>
                        <input
                            type="number"
                            contentEditable={true}
                            className="border outline-none rounded-md h-8 px-2"
                            value={phone}
                            onChange={handlePhoneChange}
                            onBlur={handleUpdatePhone}
                        />
                    </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Ship to</h3>
                <div className="font-medium text-base flex flex-col gap-4">
                    <div className="flex items-center">
                        <label className="flex-1">Address</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="address"
                                value={address?.address}
                                setValue={setAddress}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex-1">Ward</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="ward"
                                value={address?.ward}
                                setValue={setAddress}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex-1">District</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="district"
                                value={address?.district}
                                setValue={setAddress}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex-1">City</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="city"
                                value={address?.city}
                                setValue={setAddress}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-[100px]">
                            <Button
                                name={"Save"}
                                rounded
                                disabled={isDisableButtonSave}
                                handleClick={handleSaveAddress}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-3 ">
                        <Link
                            to={`/${path.CART}`}
                            className="flex items-center text-gray-600 hover:text-main"
                        >
                            <IoIosArrowRoundBack size={20} />{" "}
                            <span>Back to cart</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 border border-l-0 p-[32px] bg-[#fafafa] flex-col justify-between">
                <div className="mb-5 max-h-[512px] overflow-y-scroll">
                    {state?.selectedProducts.length ? (
                        state?.selectedProducts?.map((item) => (
                            <div className="flex mb-3 mt-3" key={`${item._id}`}>
                                <div className="w-[76px] aspect-square relative">
                                    <img
                                        alt="product"
                                        src={item?.product?.thumb}
                                        className="rounded-xl border border-gray-400"
                                    />
                                    <div className="bg-gray-600 text-white w-[24px] h-[24px] absolute top-[-8px] right-[-8px] rounded-full flex justify-center items-center">
                                        {item.quantity}
                                    </div>
                                </div>
                                <span className="flex flex-col justify-center flex-1 pl-5">
                                    <span className="text-base text-gray-900 mb-2 font-semibold">
                                        {item.product.title}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        {item.variant.map((vari, index) => {
                                            return (
                                                <span key={index}>
                                                    {index !== 0 && (
                                                        <span className="p-1">
                                                            /
                                                        </span>
                                                    )}
                                                    <span>{vari?.variant}</span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                </span>
                                <span className="pl-5 flex justify-center items-center text-base font-medium text-gray-900">
                                    {formatMoney(item.product.price)} VND
                                </span>
                            </div>
                        ))
                    ) : (
                        <i>No product is dropped into cart</i>
                    )}
                </div>

                <div>
                    <div className="flex justify-between mb-2 items-end">
                        <span className="text-lg font-medium mr-4">
                            Coupon:
                        </span>
                        {coupons ? (
                            <div className="flex flex-1 gap-3 max-w-[450px] overflow-x-scroll">
                                {coupons?.map((coupon) => (
                                    <div
                                        key={coupon?._id}
                                        className={`text-base font-medium flex flex-col bg-white px-4 py-2 
                                    border-2 hover:bg-gray-50 hover:cursor-pointer rounded-lg ${
                                        selectedCoupon?._id === coupon?._id &&
                                        "border-main"
                                    }`}
                                        onClick={() =>
                                            handleSelectCoupon(coupon)
                                        }
                                    >
                                        <span>{coupon?.title}</span>
                                        <div className="flex items-center gap-1 justify-end">
                                            <CiDiscount1 size={20} />
                                            <span>{`${coupon.discount}%`}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <i>No coupon is available</i>
                        )}
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Subtotal:</span>
                        <span className="text-base font-medium">
                            {formatMoney(subTotal)} VND
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Shipping:</span>
                        <span className="text-base font-medium">
                            {formatMoney(Math.round(subTotal * 0.02))} VND
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Discounts:</span>
                        <span className="text-base font-medium">
                            {"-"}
                            {formatMoney(
                                Math.round(
                                    (subTotal * selectedCoupon?.discount) / 100
                                )
                            )}{" "}
                            VND
                        </span>
                    </div>
                    <div className="flex justify-between border-t py-3">
                        <span className="text-lg font-semibold">TOTAL:</span>
                        <span className="text-lg font-medium">
                            {formatMoney(
                                subTotal +
                                    Math.round(subTotal * 0.02) -
                                    Math.round(
                                        (subTotal * selectedCoupon?.discount) /
                                            100
                                    )
                            )}{" "}
                            VND
                        </span>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-[100px]">
                            <Button
                                name={"Order"}
                                rounded
                                disabled={isDisableButtonOrder}
                                handleClick={handleSubmitOrder}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
