import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
// import { sendLoginInfo } from "./loginAPI";
import { LoginFormInput, LoginStatuses, selectLoginData, selectLoginStatus, sendLoginInfoAsync } from "./loginSlice";

/**
 * This file renders the React components of the Login page.
 */

function LoginForm() {
    const { register, handleSubmit } = useForm<LoginFormInput>();
    const loginData = useAppSelector(selectLoginData);
    const loginStatus = useAppSelector(selectLoginStatus);
    
    const dispatch = useDispatch<AppDispatch>();
    const onSubmit = (data: LoginFormInput) => {
        dispatch(sendLoginInfoAsync(data));
    }

    let contents;

    if (loginStatus !== LoginStatuses.LoggedIn) {
        contents = <div>{loginStatus}</div>;
    } else {
        contents = 
            <div className='card'>
                <p>{loginStatus}</p>
                <div className="card-body">
                    <h3>User ID: {loginData.user && loginData.user.id}</h3>
                    <h3>Username: {loginData.user && loginData.user.username}</h3>
                    <h3>User password digest: {loginData.user && loginData.user.password_digest}</h3>
                    <h3>User token: {loginData.token}</h3>
                </div>
            </div>
    }

    return (<div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Username" {...register("username", { required: true, maxLength: 20 })} />
            <input type="text" placeholder="Password" {...register("password", { required: true, minLength: 8 })} />
            <input type="submit" value="Login" />
        </form>
        {contents}
    </div>);
}

export default LoginForm