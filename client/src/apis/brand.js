import axios from "../axios";

export const apiGetBrands = (params) =>
    axios({
        url: "/brand/",
        method: "get",
        params,
    });

export const apiDeleteBrand = (token, bid) =>
    axios({
        url: `/brand/delete/${bid}`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
    });

export const apiAddBrand = (token, data) =>
    axios({
        url: `/brand/`,
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiEditBrand = (token, bid, data) =>
    axios({
        url: `/brand/update/${bid}`,
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiDeleteManyBrands = (token, data) =>
    axios({
        url: `/brand/deletemany`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
