import { CommentsState } from "./commentSlice";

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