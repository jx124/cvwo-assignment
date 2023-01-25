import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { LoginFormInput, AuthStatuses, selectAuthStatus, sendLoginInfoAsync } from "./authSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";


/**
 * This file renders the React components of the Login page.
 */

const loginSchema = yup.object({
    username: yup.string().required("Username required"),
    password: yup.string().required("Password required"),
});

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
        resolver: yupResolver(loginSchema),
    });

    const authStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormInput) => {
        await dispatch(sendLoginInfoAsync(data))
            .then((response) => {
                // redirect to previous page if login successful
                if (!("error" in response.payload)) {
                    navigate(-1);
                }
                return response;
            });
    }

    const signupLink = <Link to="/signup">Sign up</Link>;

    return (<div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-container"
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                <div className="card" style={{ margin: "200px", width: "500px" }}>
                    <div className="card-body text-start">
                        <h1>Login</h1>
                        <div className="mb-1">
                            <label htmlFor="formUsername" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="formUsername"
                                {...register("username")} />
                            <div className="form-text text-danger" style={{height: "21px"}}>
                                {errors.username?.message}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="formPassword" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="formPassword"
                                {...register("password")} />
                            <div className="form-text text-danger" style={{height: "21px"}}>
                                { errors.password?.message 
                                  || (authStatus === AuthStatuses.Invalid && AuthStatuses.Invalid) }
                            </div>
                        </div>
                        <div className="mb-3">
                            <input
                                type="submit"
                                className="btn btn-primary btn-lg form-control"
                                value="Login" />
                        </div>
                        <div className="mt-4 d-flex justify-content-center">
                            <p>Don't have an account? {signupLink} now.</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>);
}

export default LoginForm