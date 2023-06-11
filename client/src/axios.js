import axios from "axios";
import jwt_decode from "jwt-decode";
import { store } from "./store/store";
import { refreshToken } from "./store/user/asyncThunk";
import Cookies from "js-cookie";
import { userSlice } from "./store/user/userSlice";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import path from "./utils/path";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
});

// Add a request interceptor
instance.interceptors.request.use(
    async function (config) {
        const refToken = Cookies.get("refreshToken");
        if (refToken) {
            const decodeRefreshToken = jwt_decode(refToken);
            if (decodeRefreshToken.exp * 1000 < currentDate.getTime()) {
                await store.dispatch(userSlice.actions.logout());
                await Swal.fire("Opps!", "Please login", "error").then(() => (
                    <Navigate to={`/${path.LOGIN}`} />
                ));
            }
        }
        
        let currentDate = new Date();
        const token = store?.getState()?.user?.token;
        const isRefreshingToken = store?.getState()?.user?.isRefreshingToken;
        if (token) {
            const decodedToken = jwt_decode(token);
            if (decodedToken.exp * 1000 - 2000 < currentDate.getTime()) {
                if (!isRefreshingToken) {
                    await store.dispatch(refreshToken());
                }
            }
        }

        if (config?.headers) {
            config.headers["authorization"] = `Bearer ${
                store?.getState()?.user?.token
            }`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response?.data;
    },
    function (error) {
        console.log(error)
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return error.response.data;
    }
);

export default instance;
