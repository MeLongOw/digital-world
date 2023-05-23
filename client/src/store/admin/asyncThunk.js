import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getCurrent = createAsyncThunk(
    "user/current",
    async (token, { rejectWithValue }) => {
        const response = await apis.apiGetCurrent(token);
        if (!response.success) return rejectWithValue(response);
        return response.result;
    }
);
