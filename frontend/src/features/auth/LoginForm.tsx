import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { LoginFormInput, AuthStatuses, selectAuthData, selectAuthStatus, sendLoginInfoAsync } from "./authSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


/**
 * This file renders the React components of the Login page.
 */

const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});

function LoginForm() {
    const { register, handleSubmit, formState: {errors} } = useForm<LoginFormInput>({
        resolver: yupResolver(loginSchema),
    });

    const loginData = useAppSelector(selectAuthData);
    const loginStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();
    
    const onSubmit = (data: LoginFormInput) => {
        dispatch(sendLoginInfoAsync(data));
    }

    let contents;

    if (loginStatus !== AuthStatuses.LoggedIn) {
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
            <input type="text" placeholder="Username" {...register("username")} />
            <input type="text" placeholder="Password" {...register("password")} />
            <input type="submit" value="Login" />
        </form>
        {contents}
    </div>);
}

export default LoginForm