import { CommentsState, CreateCommentRequest } from "./commentSlice";

const API_URL = "http://localhost:3000";

export async function fetchComments(query: string) {
    return fetch(`${API_URL}/comments/${query}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // Add auth token here
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