import { createSlice } from "@reduxjs/toolkit";
import { getCurrent } from "./asyncThunk";

export const adminSlice = createSlice({
    name: "admin",
    initialState: {
        isLoading: false,
        isLoggedIn: false,
        isEditting: false,
        current: null,
        token: null,
        errorMessage: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.current = action.payload.userData;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.current = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getCurrent.fulfilled, (state, action) => {
            
            console.log('user   ',action.payload)
            state.current = action.payload;
        });

        builder.addCase(getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});
