import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import path from "../../utils/path";

const AuthRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    if (status === "failed") {
        Swal.fire("Opp!", "Register Failed!", "error").then(() => {
            navigate(`/${path.LOGIN}`);
        });
    }
    if (status === "success") {
        Swal.fire("Congration!", "Register is success!", "success").then(() => {
            navigate(`/${path.LOGIN}`);
        });
    }
    return <div className="w-screen h-screen bg-gray-100"></div>;
};

export default AuthRegister;
