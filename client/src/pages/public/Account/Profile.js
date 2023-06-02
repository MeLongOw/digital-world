import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiUpdateUserAddress, apiUpdateUserInformation } from "../../../apis";
import { Button, InputField } from "../../../components";
import { getCurrent } from "../../../store/user/asyncThunk";
import { capitalize } from "../../../utils/helpers";

const Profile = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.current);
    const token = useSelector((state) => state.user.token);
    console.log(currentUser);

    const [payload, setPayload] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });
    const [address, setAddress] = useState({
        address: "",
        ward: "",
        district: "",
        city: "",
    });
    console.log(address);

    const handleSaveChange = async () => {
        const updateUser = [];
        updateUser.push(
            apiUpdateUserAddress(token, {
                address: JSON.stringify(address),
            }),
            apiUpdateUserInformation(token, payload)
        );
        await Promise.all(updateUser);
        dispatch(getCurrent(token));
        return true;
    };

    useEffect(() => {
        setPayload({
            firstName: currentUser?.firstName,
            lastName: currentUser?.lastName,
            phone: currentUser?.phone,
        });
        if (currentUser?.address) setAddress(JSON.parse(currentUser?.address));
    }, [currentUser]);

    return (
        <div>
            <h3 className="h-[48px] flex items-center font-semibold text-xl">
                PROFILE
            </h3>
            <div className="py-4 font-medium text-lg">
                <h4 className=" mb-5">ACCOUNT INFORMATION</h4>
                <div className="font-normal text-base flex flex-col gap-4 mb-5">
                    <div className="flex items-center">
                        <label className="flex-1">First Name</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="firstName"
                                value={capitalize(payload?.firstName)}
                                setValue={setPayload}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex-1">Last Name</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="lastName"
                                value={capitalize(payload?.lastName)}
                                setValue={setPayload}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex-1">Phone</label>
                        <div className="flex-4">
                            <InputField
                                nameKey="phone"
                                value={payload?.phone}
                                setValue={setPayload}
                            />
                        </div>
                    </div>
                </div>

                {/* ADdRESS */}
                <h4 className=" mb-5">ADDRESS</h4>
                <div className="font-normal text-base flex flex-col gap-4 mb-5">
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
                                handleClick={handleSaveChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
