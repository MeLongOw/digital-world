import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { apiUpdateUserAddress, apiUpdateUserInformation } from "../../apis";
import { Button, InputField } from "../../components";
import { compareObjects, formatMoney } from "../../utils/helpers";
import icons from "../../utils/icons";

const defaultAdress = { address: "", ward: "", district: "", city: "" };

const Checkout = () => {
    const currentUser = useSelector((state) => state.user.current);
    const token = useSelector((state) => state.user.token);

    console.log(currentUser?.address);
    const [address, setAddress] = useState(defaultAdress);
    console.log(address);
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
            if (response?.success) setIsDisableButtonSave(true);
        }
        return true;
    };

    const subTotal = useMemo(() => {
        return (
            currentUser?.cart?.reduce(
                (total, item) => (total += +item?.product.price),
                0
            ) || 0
        );
    }, [currentUser]);

    useEffect(() => {
        if (isDisableButtonSave && !compareObjects(address, defaultAdress)) {
            setisDisableButtonOrder(false);
        } else {
            setisDisableButtonOrder(true);
        }
    }, [isDisableButtonSave]);

    useEffect(() => {
        if (currentUser?.address) {
            if (compareObjects(JSON.parse(currentUser?.address), address)) {
                setIsDisableButtonSave(true);
            } else {
                setIsDisableButtonSave(false);
            }
        }
    }, [address]);

    useEffect(() => {
        if (currentUser?.phone) setPhone(currentUser?.phone);
        if (currentUser?.address) setAddress(JSON.parse(currentUser?.address));
    }, [currentUser]);

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
                </div>
            </div>
            <div className="flex flex-1 border border-l-0 p-[32px] bg-[#fafafa] flex-col justify-between">
                <div className="mb-5 max-h-[512px] overflow-y-scroll">
                    {currentUser?.cart?.map((item) => (
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
                    ))}
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Subtotal:</span>
                        <span className="text-base font-medium">
                            {formatMoney(subTotal)} VND
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Shipping:</span>
                        <span className="text-base font-medium">
                            100.000.000 VND
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Discounts:</span>
                        <span className="text-base font-medium">
                            100.000.000 VND
                        </span>
                    </div>
                    <div className="flex justify-between border-t py-3">
                        <span className="text-lg font-semibold">TOTAL:</span>
                        <span className="text-lg font-medium">
                            100.000.000 VND
                        </span>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-[100px]">
                            <Button
                                name={"Order"}
                                rounded
                                disabled={isDisableButtonOrder}
                                // handleClick={handleSaveChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
