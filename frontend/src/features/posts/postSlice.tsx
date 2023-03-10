import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState } from "../../app/store";
import { createPost, fetchPosts, destroyPost, fetchSpecificPosts, updatePost } from "./postAPI";

/**
 * This file defines the post interfaces and implements their async thunks and reducers.
 */

export enum PostStatuses {
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
    username?: string;
    comment_count?: number;
}

export interface PostsState {
    posts: PostState[];
    rankedPosts: PostState[];
    status: PostStatuses;
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
            username: "",
            comment_count: 0,
        }
    ],
    rankedPosts: [
        {
            id: 0,
            title: "",
            body: "",
            tags: [],
            rating: 0,
            user_id: 0,
            created_at: "",
            updated_at: "",
            username: "",
            comment_count: 0,
        }
    ],
    status: PostStatuses.Initial
}

export interface PostFormInput {
    title: string;
    body: string;
    tags: {
        item: string;
    }[]
}

export interface CreatePostRequest {
    post: {
        title: string;
        body: string;
        tags: string[];
        user_id: number;
    },
    token: string;
}

export interface DeletePostRequest {
    post: {
        post_id: number;
    },
    token: string;
}

export interface UpdatePostRequest {
    post_id: number;
    post: {
        title: string;
        body: string;
        tags: string[];
        user_id: number;
    },
    token: string;
}


export const fetchPostsAsync = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        const response = await fetchPosts();
        return response;
    }
)

export const fetchSpecificPostsAsync = createAsyncThunk(
    "posts/fetchSpecificPosts",
    async (queryString: string) => {
        const response = await fetchSpecificPosts(queryString);
        return response;
    }
)

export const createPostAsync = createAsyncThunk(
    "posts/createPost",
    async (request: CreatePostRequest) => {
        const response = await createPost(request);
        return response;
    }
)

export const updatePostAsync = createAsyncThunk(
    "posts/updatePost",
    async (request: UpdatePostRequest) => {
        const response = await updatePost(request);
        return response;
    }
)

export const destroyPostAsync = createAsyncThunk(
    "posts/destroyPost",
    async (request: DeletePostRequest) => {
        const response = await destroyPost(request);
        return response;
    }
)

export const postSlice = createSlice({
    name: "posts",
    initialState,

    // Synchronous actions
    reducers: {
        setRankedPosts: (state, action) => {
            return produce(state, (draftState) => {
                draftState.rankedPosts = action.payload;
            })
        }
    },

    // Async actions
    extraReducers: (builder) => {
        builder
            /* Fetch section */
            .addCase(fetchPostsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Loading;
                })
            })
            .addCase(fetchPostsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = PostStatuses.UpToDate;
                })
            })
            .addCase(fetchPostsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Error;
                })
            })
            .addCase(fetchSpecificPostsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Loading;
                })
            })
            .addCase(fetchSpecificPostsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = PostStatuses.UpToDate;
                })
            })
            .addCase(fetchSpecificPostsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Error;
                })
            })
            /* Create section */
            .addCase(createPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Loading;
                })
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts.push(action.payload);
                    draftState.status = PostStatuses.UpToDate;
                })
            })
            .addCase(createPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Error;
                })
            })
            /* Update section */
            .addCase(updatePostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Loading;
                })
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.posts.findIndex(
                        (post) => post.id === action.payload.id);

                    draftState.posts[index] = action.payload;
                    draftState.status = PostStatuses.UpToDate;
                })
            })
            .addCase(updatePostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Error;
                })
            })
            /* Destroy section */
            .addCase(destroyPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Loading;
                })
            })
            .addCase(destroyPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = PostStatuses.UpToDate;
                })
            })
            .addCase(destroyPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = PostStatuses.Error;
                })
            })
    }
})

export const { setRankedPosts } = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectRankedPosts = (state: RootState) => state.posts.rankedPosts;
export const selectPostStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;