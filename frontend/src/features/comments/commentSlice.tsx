import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { createComment, destroyComment, fetchComments, updateComment } from "./commentAPI";

export enum CommentStatuses {
    Initial = "Not Fetched",
    Loading = "Loading...",
    UpToDate = "Up To Date",
    Deleted = "Deleted",
    Error = "Error",
}

export interface CommentState {
    id?: number;
    body?: string;
    rating?: number;
    post_id?: number;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
    username?: string;
}

export interface CommentProp {
    data: {
        id?: number;
        body?: string;
        rating?: number;
        post_id?: number;
        user_id?: number;
        created_at?: string;
        updated_at?: string;
        username?: string;
    },
    clickable: boolean;
}

export interface CommentsState {
    comments: CommentState[];
    status: CommentStatuses; // every comment should have its own status?
}

const initialState: CommentsState = {
    comments: [
        {
            id: 0,
            body: "",
            rating: 0,
            post_id: 0,
            user_id: 0,
            created_at: "",
            updated_at: "",
            username: "",
        },
    ],
    status: CommentStatuses.Initial, // every comment should have its own status?
}

export interface CommentFormInput {
    body: string;
}

export interface CreateCommentRequest {
    data: {
        body: string;
        post_id: number;
        user_id: number;
    },
    token: string;
}

export interface UpdateCommentRequest {
    comment_id: number,
    data: {
        body: string;
    },
    token: string;
}

export interface DeleteCommentRequest {
    comment_id: number,
    token: string;
}

export const fetchCommentsAsync = createAsyncThunk(
    "comments/fetchComments",
    async (query: string) => {
        const response = await fetchComments(query);
        return response;
    }
)

export const createCommentAsync = createAsyncThunk(
    "comments/createComment",
    async (request: CreateCommentRequest) => {
        const response = await createComment(request);
        return response;
    }
)

export const updateCommentAsync = createAsyncThunk(
    "comments/updateComment",
    async (request: UpdateCommentRequest) => {
        const response = await updateComment(request);
        return response;
    }
)

export const destroyCommentAsync = createAsyncThunk(
    "comments/destroyComment",
    async (request: DeleteCommentRequest) => {
        const response = await destroyComment(request);
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
                    draftState.comments = action.payload;
                    draftState.status = CommentStatuses.UpToDate;
                })
            })
            .addCase(fetchCommentsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Error;
                })
            })
            /* Create section */
            .addCase(createCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Loading;
                })
            })
            .addCase(createCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    if (!("error" in action.payload)) {
                        draftState.comments.push(action.payload);
                        draftState.status = CommentStatuses.UpToDate;
                    } else {
                        draftState.status = CommentStatuses.Error;
                    }
                })
            })
            .addCase(createCommentAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Error;
                })
            })
            /* Update section */
            .addCase(updateCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Loading;
                })
            })
            .addCase(updateCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.comments.findIndex(
                        (comments) => comments.id === action.payload.id);

                    draftState.comments[index] = action.payload;
                    draftState.status = CommentStatuses.UpToDate;
                })
            })
            .addCase(updateCommentAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Error;
                })
            })
            /* Destroy section */
            .addCase(destroyCommentAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = CommentStatuses.Loading;
                })
            })
            .addCase(destroyCommentAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.comments = action.payload;
                    draftState.status = CommentStatuses.UpToDate;
                })
            })
            .addCase(destroyCommentAsync.rejected, (state) => {
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
