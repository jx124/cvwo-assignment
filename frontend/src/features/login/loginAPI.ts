import { LoginFormInput, LoginData } from "./loginSlice";

/**
 * This file contains all API methods for logging in.
 */

const API_URL = "http://localhost:3000";

export async function sendLoginInfo(data: LoginFormInput) {
    console.log(data);
    return fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as LoginData;
        })
}