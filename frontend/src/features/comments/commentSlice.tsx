import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { fetchComments } from "./commentAPI";

export enum CommentStatuses {
    Initial = "Not Fetched",
    Loading = "Loading...",
    UpToDate = "Up To Date",
    Deleted = "Deleted",
    Error = "Error",
}

export interface CommentState {
    id?: string;
    body?: string;
    rating?: number;
    post_id?: number;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CommentsState {
    comments: CommentState[];
    status: CommentStatuses; // every comment should have its own status?
}

const initialState: CommentsState = {
    comments: [
        {
            id: "",
            body: "",
            rating: 0,
            post_id: 0,
            user_id: 0,
            created_at: "",
            updated_at: "",
        },
    ],
    status: CommentStatuses.Initial, // every comment should have its own status?
}

export const fetchCommentsAsync = createAsyncThunk(
    "comments/fetchComments",
    async (query: string) => {
        const response = await fetchComments(query);
        console.log("comments/fetchComments response: ", response);
        return response;
    }
)

export const commentSlice = createSlice({
    name: "comments",
    initialState,

    // Synchronous actions
    reducers: {},

    // Async actions
    extraReducers: (builder) => {
        builder
            /* Fetch section */
            .addCase(fetchCommentsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    // draftState is a copy of the actual state which will be applied appropriately
                    draftState.status = CommentStatuses.Loading;
                })
            })
            .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    console.log("Payload in reducer: ", action.payload)
                    draftState.comments = action.payload;
                    draftState.status = CommentStatuses.UpToDate;
                })
            })
            .addCase(fetchCommentsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Error;
                })
            })
    }
})

export const {} = commentSlice.actions;

export const selectComments = (state: RootState) => state.comments.comments; 

export const selectCommentStatus = (state: RootState) => state.comments.status;

export default commentSlice.reducer;
