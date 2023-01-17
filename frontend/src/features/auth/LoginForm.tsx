import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { LoginFormInput, AuthStatuses, selectAuthData, selectAuthStatus, sendLoginInfoAsync, logout } from "./authSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "react-bootstrap";


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

    const authData = useAppSelector(selectAuthData);
    const authStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();
    
    const onSubmit = (data: LoginFormInput) => {
        dispatch(sendLoginInfoAsync(data));
    }

    const onLogout = () => {
        dispatch(logout());
    }

    let contents;

    if (authStatus !== AuthStatuses.LoggedIn) {
        contents = <div>
            <p>{authStatus}</p>
            <p>{authData.user ? "username: " + authData.user.username : "no username"}</p>
            <p>{authData.token ? "username: " + authData.token : "no token"}</p>
        </div>;
    } else {
        contents =
            <>
            <div className='card'>
                <p>{authStatus}</p>
                <div className="card-body">
                    <h3>User ID: {authData.user && authData.user.id}</h3>
                    <h3>Username: {authData.user && authData.user.username}</h3>
                    <h3>User password digest: {authData.user && authData.user.password_digest}</h3>
                    <h3>User token: {authData.token}</h3>
                </div>
            </div>
            <div>
                <Button variant="outline-danger" onClick={onLogout}>Sign out</Button>
            </div>
            </>
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