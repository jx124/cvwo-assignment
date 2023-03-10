import { CommentsState, CreateCommentRequest, DeleteCommentRequest, UpdateCommentRequest } from "./commentSlice";

const API_URL = "https://cvwo-app.herokuapp.com";

/**
 * This file contains all API methods for comment CRUD operations.
 */

// query includes post_id and/or user_id
export async function fetchComments(query: string) {
    return fetch(`${API_URL}/comments/${query}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as CommentsState;
    });
}

export async function createComment(request: CreateCommentRequest) {
    return fetch(`${API_URL}/comments.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.token}`
        },
        body: JSON.stringify(request.data),
    })
    .then((response) => response.json())
    .catch((error) => {
        console.log("Error: ", error);
        return {} as CommentsState;
    });
}

export async function updateComment(request: UpdateCommentRequest) {
    return fetch(`${API_URL}/comments/${request.comment_id}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.token}`
        },
        body: JSON.stringify(request.data),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as CommentsState;
        });
}

export async function destroyComment(request: DeleteCommentRequest) {
    return fetch(`${API_URL}/comments/${request.comment_id}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.token}`
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as CommentsState;
        });
}