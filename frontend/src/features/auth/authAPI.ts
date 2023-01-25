import { LoginFormInput, AuthData, SignupFormInput } from "./authSlice";

/**
 * This file contains all API methods for logging in or signing up.
 */

const API_URL = "http://localhost:3000";

export async function sendLoginInfo(data: LoginFormInput) {
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
            return {} as AuthData;
        })
}

export async function sendSignupInfo(data: SignupFormInput) {
    // Remove duplicate field confirmPassword
    const strippedData: LoginFormInput = {
        username: data.username,
        password: data.password,
    };
    
    return fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(strippedData)
    })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Error: ", error);
            return {} as AuthData;
        })
}