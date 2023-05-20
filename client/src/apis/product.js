import axios from "../axios";

export const apiGetProducts = (params) =>
    axios({
        url: "/product/",
        method: "get",
        params,
    });
export const apiGetProduct = (params) =>
    axios({
        url: `/product/get/${params}`,
        method: "get",
    });
