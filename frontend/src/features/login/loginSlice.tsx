import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { sendLoginInfo } from "./loginAPI";

/**
 * This file defines the interfaces and implements slices and reducers for logging in.
 */

export enum LoginStatuses {
    Initial = "Not Logged in",
    Loading = "Logging in...",
    LoggedIn = "User logged in",
    Deleted = "User not found",
    Error = "Error",
}

export interface LoginFormInput {
    username: string;
    password: string;
}

export interface LoginData {
    user?: {
        id?: number;
        username?: string;
        password_digest?: string;
        created_at?: string;
        updated_at?: string;
    };
    token?: string;
}

export interface LoginState {
    data: LoginData;
    status: LoginStatuses;
}

const initialState: LoginState = {
    data: {
            user: {
                id: 0,
                username: "",
                password_digest: "",
                created_at: "",
                updated_at: "",
            },
            token: "",
    },
    status: LoginStatuses.Initial,
}

export const sendLoginInfoAsync = createAsyncThunk(
    "login/sendLoginInfo",
    async (data: LoginFormInput) => {
        const response = await sendLoginInfo(data);
        console.log("received data in thunk: ", response);
        return response;
    }
)

export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendLoginInfoAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = LoginStatuses.Loading;
                })
            })
            .addCase(sendLoginInfoAsync.fulfilled, (state, action: PayloadAction<void | LoginData>) => {
                return produce(state, (draftState) => {
                    if (action.payload) {
                        draftState.data = action.payload;
                        console.log("set draftState.data to: ", draftState.data);
                        draftState.status = LoginStatuses.LoggedIn;
                    } else {
                        console.log("hit else block in reducer");
                    }
                })
            })
            .addCase(sendLoginInfoAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = LoginStatuses.Error;
                })
            })
    },
})

export const {} = loginSlice.actions;

export const selectLoginData = (state: RootState) => state.login.data;

export const selectLoginStatus = (state: RootState) => state.login.status;

export default loginSlice.reducer;