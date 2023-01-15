import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { fetchPosts } from "./postAPI";

export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...",
    UpToDate = "Up To Date",
    Deleted = "Deleted",
    Error = "Error",
}

export interface PostState {
    id?: number;
    title?: string;
    body?: string;
    tags?: string[];
    rating?: number;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PostsState {
    posts: PostState[];
    status: string;
}

const initialState: PostsState = {
    posts: [
        {
            id: 0,
            title: "",
            body: "",
            tags: [],
            rating: 0,
            user_id: 0,
            created_at: "",
            updated_at: "",
        }
    ],

    status: Statuses.Initial
}

export const fetchPostAsync = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        const response = await fetchPosts();
        return response;
    }
)

export const postSlice = createSlice({
    name: "posts",
    initialState,

    // Synchronous actions
    reducers: {},

    // Async actions
    extraReducers: (builder) => {
        builder
            /* Fetch section */
            .addCase(fetchPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    // draftState is a copy of the actual state which will be applied appropriately
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })
            .addCase(fetchPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts; 

export const selectStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;