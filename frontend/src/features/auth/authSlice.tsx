import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { sendLoginInfo, sendSignupInfo } from "./authAPI";

/**
 * This file defines the interfaces and implements slices and reducers for logging in.
 */

export enum AuthStatuses {
    Initial = "Not Logged in",
    Loading = "Logging in...",
    LoggedIn = "User logged in",
    Invalid = "Invalid username or password",
    Error = "Error",
}

export interface LoginFormInput {
    username: string;
    password: string;
}

export interface SignupFormInput {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface AuthData {
    user?: {
        id?: number;
        username?: string;
        password_digest?: string;
        created_at?: string;
        updated_at?: string;
    };
    token?: string;
}

const loginError = JSON.stringify({
    error: "Invalid username or password",
});

export interface LoginState {
    data: AuthData;
    status: AuthStatuses;
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
    status: AuthStatuses.Initial,
}

export const sendLoginInfoAsync = createAsyncThunk(
    "auth/sendLoginInfo",
    async (data: LoginFormInput) => {
        const response = await sendLoginInfo(data);
        console.log("auth/sendLoginInfo: received data in thunk: ", response);
        return response;
    }
)

export const sendSignupInfoAsync = createAsyncThunk(
    "auth/sendSignupInfo",
    async (data: SignupFormInput) => {
        const response = await sendSignupInfo(data);
        console.log("auth/sendSignupInfo: received data in thunk: ", response);
        return response;
    }
)

export const loginSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendLoginInfoAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = AuthStatuses.Loading;
                })
            })
            .addCase(sendLoginInfoAsync.fulfilled, (state, action: PayloadAction<void | AuthData>) => {
                return produce(state, (draftState) => {
                    if (action.payload && JSON.stringify(action.payload) == loginError) {
                        draftState.data = action.payload;
                        console.log("account not found ", draftState.data);
                        draftState.status = AuthStatuses.Invalid;
                    } else if (action.payload) {
                        draftState.data = action.payload;
                        console.log("set draftState.data to: ", draftState.data);
                        draftState.status = AuthStatuses.LoggedIn;
                    } else {
                        console.log("hit else block in reducer");
                    }
                })
            })
            .addCase(sendLoginInfoAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = AuthStatuses.Error;
                })
            })
            .addCase(sendSignupInfoAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = AuthStatuses.Loading;
                })
            })
            .addCase(sendSignupInfoAsync.fulfilled, (state, action: PayloadAction<void | AuthData>) => {
                return produce(state, (draftState) => {
                    if (action.payload && JSON.stringify(action.payload) == loginError) {
                        draftState.data = action.payload;
                        console.log("account not found ", draftState.data);
                        draftState.status = AuthStatuses.Invalid;
                    } else if (action.payload) {
                        draftState.data = action.payload;
                        console.log("set draftState.data to: ", draftState.data);
                        draftState.status = AuthStatuses.LoggedIn;
                    } else {
                        console.log("hit else block in reducer");
                    }
                })
            })
            .addCase(sendSignupInfoAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = AuthStatuses.Error;
                })
            })
    },
})

export const {} = loginSlice.actions;

export const selectAuthData = (state: RootState) => state.auth.data;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export default loginSlice.reducer;