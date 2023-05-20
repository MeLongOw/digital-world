import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiResetPassword } from "../../apis";
import { Button, InputField } from "../../components";
import path from "../../utils/path";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [payload, setPayload] = useState({
        password: "",
        confirmPassword: "",
    });
    const handleChangePassword = async () => {
        const { password, confirmPassword } = payload;
        if (!password || !confirmPassword) {
            Swal.fire("Opps!", "Missing input(s)", "error");
        }
        if (password === confirmPassword) {
            const response = await apiResetPassword({ password, token });
            if (response.success) {
                Swal.fire(
                    "Success!",
                    "Reset password is successful!",
                    "success"
                ).then(navigate(`/${path.LOGIN}`));
            } else {
                Swal.fire("Failed!", response.mes, "error").then();
            }
        } else {
            Swal.fire(
                "Opps!",
                "Password and confirm password do not match!",
                "error"
            );
        }
    };

    return (
        <div className="w-screen h-screen relative flex items-center justify-center ">
            <div className="w-[500px] border bg-white shadow-2xl rounded-xl pt-5 px-5 pb-10 flex flex-col items-center">
                <h3 className="font-semibold mb-5 text-main">Reset password</h3>

                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey="password"
                    title="Password"
                    type="password"
                />

                <InputField
                    value={payload.confirmPassword}
                    setValue={setPayload}
                    nameKey="confirmPassword"
                    title="Confirm password"
                    type="password"
                />

                <div className="mt-4 w-full">
                    <Button name="Submit" handleClick={handleChangePassword} />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
