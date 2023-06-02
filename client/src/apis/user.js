import axios from "../axios";

export const apiRegister = (data) =>
    axios({
        url: "/user/register",
        method: "post",
        withCredentials: true,
        data,
    });

export const apiLogin = (data) =>
    axios({
        url: "/user/login",
        method: "post",
        withCredentials: true,
        data,
    });

export const apiLogout = () =>
    axios({
        url: "/user/logout",
        method: "get",
        withCredentials: true,
    });

export const apiForgotPassword = (data) =>
    axios({
        url: "/user/forgotpassword",
        method: "post",
        data,
    });

export const apiResetPassword = (data) =>
    axios({
        url: "/user/resetpassword",
        method: "put",
    });

export const apiGetCurrent = (token) =>
    axios({
        url: "/user/current",
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
    });

export const apiAddWishList = (token, data) =>
    axios({
        url: "/user/addwishlist",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiRemoveWishList = (token, data) =>
    axios({
        url: "/user/removewishlist",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiAddToCart = (token, data) =>
    axios({
        url: "/user/updatecart",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiRemoveFromCart = (token, data) =>
    axios({
        url: "/user/removeformcart",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiUpdateCart = (token, data) =>
    axios({
        url: "/user/updatecart",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiUpdateUserAddress = (token, data) =>
    axios({
        url: "/user/address",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
export const apiUpdateUserInformation = (token, data) =>
    axios({
        url: "/user/current",
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

//ADMIN
export const apiGetUsers = (token, params) =>
    axios({
        url: "/user/",
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
        params,
    });

export const apiEditUser = (token, uid, data) =>
    axios({
        url: `/user/update/${uid}`,
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apideleteUser = (token, params) =>
    axios({
        url: "/user/delele",
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
        params,
    });

export const apiDeleteManyUsers = (token, data) =>
    axios({
        url: `/user/deletemany`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
