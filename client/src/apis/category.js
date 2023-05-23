import axios from "../axios";

export const apiDeleteCategory = (token, cid) =>
    axios({
        url: `/prodcategory/delete/${cid}`,
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
    });

export const apiAddCategory = (token, data) =>
    axios({
        url: `/prodcategory/`,
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });

export const apiEditCategory = (token, cid, data) =>
    axios({
        url: `/prodcategory/update/${cid}`,
        method: "put",
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
