import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { AuthStatuses, logout, selectAuthData, selectAuthStatus, sendSignupInfoAsync, SignupFormInput } from "./authSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "react-bootstrap";


/**
 * This file renders the React components of the Login page.
 */

const signupSchema = yup.object({
    username: yup.string().min(3).max(25).required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required(),
});

function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInput>({
        resolver: yupResolver(signupSchema),
    });

    const loginData = useAppSelector(selectAuthData);
    const loginStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = (data: SignupFormInput) => {
        dispatch(sendSignupInfoAsync(data));
    }

    const onLogout = () => {
        dispatch(logout());
    }

    let contents = null;

    if (loginStatus !== AuthStatuses.LoggedIn) {
        contents = <div>{loginStatus}</div>;
    } else {
        contents =
            <>
                <div className='card'>
                    <p>{loginStatus}</p>
                    <div className="card-body">
                        <h3>User ID: {loginData.user && loginData.user.id}</h3>
                        <h3>Username: {loginData.user && loginData.user.username}</h3>
                        <h3>User password digest: {loginData.user && loginData.user.password_digest}</h3>
                        <h3>User token: {loginData.token}</h3>
                    </div>
                </div>
                <div>
                    <Button variant="outline-danger" onClick={onLogout}>Sign out</Button>
                </div>
            </>
    }

    return (<div>
        <h1>Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Username" {...register("username")} />
            <p>{errors.username?.message}</p>
            <p>{loginStatus == AuthStatuses.DuplicateUsername && AuthStatuses.DuplicateUsername}</p>
            <input type="text" placeholder="Password" {...register("password")} />
            <p>{errors.password?.message}</p>
            <input type="text" placeholder="Confirm Password" {...register("confirmPassword")} />
            <p>{errors.confirmPassword?.message}</p>
            <input type="submit" value="Register" />
        </form>
        {contents}
    </div>);
}

export default SignupForm