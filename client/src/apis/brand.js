import axios from "../axios";

export const apiGetBrands = () =>
    axios({
        url: "/brand/",
        method: "get",
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
