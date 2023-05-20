import React, { useCallback, useEffect, useState } from "react";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/config";
import { InputField, Button } from "../../components";
import { apiForgotPassword, apiLogin, apiRegister } from "../../apis";
import path from "../../utils/path";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "../../store/user/userSlice";
import icons from "../../utils/icons";
import { validate } from "../../utils/helpers";

const { AiOutlineClose } = icons;

const provider = new FacebookAuthProvider();

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)

    useEffect(()=>{
        if(isLoggedIn){
            navigate('/')
        }
    },[isLoggedIn])
  

    const [payload, setPayload] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
    });

    const [invalidFields, setInvalidFields] = useState([]);
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState("");

    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email });
        Swal.fire(
            response.success ? "Success" : "Opps!",
            response.mes || "Please check your mail to reset your password",
            response.success ? "success" : "error"
        ).then(() => {
            if (response.success) {
                setIsForgotPassword(false);
                setEmail("");
            }
        });
    };

    const handleSubmit = useCallback(async () => {
        const { firstName, lastName, phone, ...data } = payload;

        const invalidCount = isRegister
            ? validate(payload, setInvalidFields)
            : validate(data, setInvalidFields);

        if (!invalidCount) {
            if (isRegister) {
                const response = await apiRegister(payload);
                Swal.fire(
                    response.success ? "Congratulation" : "Opps!",
                    response.mes,
                    response.success ? "success" : "error"
                ).then(() => {
                    if (response.success) {
                        setIsRegister(false);
                        setPayload({
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            phone: "",
                        });
                    }
                });
            } else {
                const response = await apiLogin(data); 
                if (response.success) {
                    dispatch(
                        userSlice.actions.login({
                            isLoggedIn: true,
                            token: response.accessToken,
                            userData: response.userData,
                        })
                    );
                    navigate(`/${path.HOME}`);
                } else {
                    Swal.fire("Opps!", response.mes, "error");
                }
            }
        }
    }, [isRegister, payload]);

    const handleLoginWithFacebook = () => {
        signInWithPopup(auth, provider)
            .then((res) => {
                // The signed-in user info.
                const user = res.user;
                console.log(user);
            })
            .catch((error) => {
                Swal.fire("Opps!", error.message, "error");
            });
    };

    return (
        <div className="w-screen h-screen relative flex items-center justify-center ">
            <div
                className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-overlay ${
                    isForgotPassword ? "" : "hidden"
                }`}
                onClick={(e) => setIsForgotPassword(false)}
            >
                <div
                    className="w-1/3 flex flex-col bg-white p-4 rounded-xl animate-slide-top"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between">
                        <label htmlFor="email">
                            Enter your email to reset password:
                        </label>
                        <button onClick={() => setIsForgotPassword(false)}>
                            <AiOutlineClose size={20} />
                        </button>
                    </div>
                    <input
                        className="w-full p-2 border-b outline-none placeholder:text-sm mb-6 mt-2"
                        type="text"
                        id="email"
                        placeholder="Exp: email@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        name="Submit"
                        handleClick={handleForgotPassword}
                    ></Button>
                </div>
            </div>
            <div className="w-[500px] border bg-white shadow-2xl rounded-xl pt-5 px-5 pb-5 flex flex-col items-center">
                <h3 className="font-semibold mb-5 text-main">
                    {isRegister ? "Register" : "Login"}
                </h3>
                {isRegister && (
                    <>
                        <div className="flex items-center gap-3">
                            <InputField
                                value={payload.firstName}
                                setValue={setPayload}
                                nameKey="firstName"
                                title={"First Name"}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />
                            <InputField
                                value={payload.lastName}
                                setValue={setPayload}
                                nameKey="lastName"
                                title={"Last Name"}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />
                        </div>
                        <InputField
                            value={payload.phone}
                            setValue={setPayload}
                            nameKey="phone"
                            title={"Phone"}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />
                    </>
                )}
                <InputField
                    value={payload.email}
                    setValue={setPayload}
                    nameKey="email"
                    title={"Email"}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                />
                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey="password"
                    type={"password"}
                    title={"Password"}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                />
                <div className="flex items-center justify-between my-2 w-full text-sm">
                    {!isRegister ? (
                        <span
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => setIsForgotPassword(true)}
                        >
                            Forgot your account?
                        </span>
                    ) : (
                        <span></span>
                    )}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => {
                            setIsRegister(!isRegister);
                        }}
                    >
                        {isRegister ? "Go login" : "Create new account"}
                    </span>
                </div>
                <div className="mt-4 w-full">
                    <Button
                        name={isRegister ? "Register" : "Login"}
                        handleClick={handleSubmit}
                    />
                </div>
                {!isRegister && (
                    <>
                        <div className="mt-4 w-full">
                            <Button
                                name={"Login with Facebook"}
                                handleClick={handleLoginWithFacebook}
                                backgroundColor="bg-blue-600"
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <Button
                                name={"Login with Google"}
                                handleClick={handleSubmit}
                                backgroundColor="bg-orange-500"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
