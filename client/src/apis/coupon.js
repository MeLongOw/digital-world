import axios from "../axios";

export const apiGetCoupons = (params) =>
    axios({
        url: "/coupon/",
        method: "get",
        params,
    });

export const apiAddCoupon = (token, data) =>
    axios({
        url: `/coupon/`,
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiDeleteCoupon = (token, cid) =>
    axios({
        url: `/coupon/delete/${cid}`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
    });

export const apiEditCoupon = (token, cid, data) =>
    axios({
        url: `/coupon/update/${cid}`,
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiDeleteManyCoupons = (token, data) =>
    axios({
        url: `/coupon/deletemany`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
