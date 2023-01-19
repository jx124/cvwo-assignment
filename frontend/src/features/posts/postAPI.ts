import { AuthData } from "../auth/authSlice";
import { CreatePostRequest, DeletePostRequest, PostFormInput, PostsState } from "./postSlice";

const API_URL = "http://localhost:3000";

export async function fetchPosts() {
    return fetch(`${API_URL}/posts.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // Add auth token here
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as PostsState;
        });
}

export async function createPost(request: CreatePostRequest) {
    return fetch(`${API_URL}/posts.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.token}`
        },
        body: JSON.stringify(request.post),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as PostsState;
        });
}

export async function destroyPost(request: DeletePostRequest) {
    console.log("request: ", request);
    return fetch(`${API_URL}/posts/${request.post.post_id}.json`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.token}`
        },
        body: JSON.stringify(request.post),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as PostsState;
        });
}