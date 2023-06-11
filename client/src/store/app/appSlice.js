import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./asyncThunk";
export const appSlice = createSlice({
    name: "app",
    initialState: {
        categories: null,
        isLoading: false,
        isIconCardClick: false,
        isShowCart: false,
    },
    reducers: {
        toggleCart: (state) => {
            state.isShowCart = !state.isShowCart;
        },
        setisIconCartClickTrue: (state) => {
            state.isIconCardClick = true;
        },
        setisIconCartClickFalse: (state) => {
            state.isIconCardClick = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload.prodCategories;
        });

        builder.addCase(getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload?.message;
        });
    },
});
