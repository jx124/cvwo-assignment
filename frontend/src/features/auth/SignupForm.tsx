import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { AuthStatuses, selectAuthStatus, sendSignupInfoAsync, SignupFormInput } from "./authSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";


/**
 * This file renders the React components of the Login page.
 */

const signupSchema = yup.object({
    username: 
        yup.string()
            .min(3, "Username must be at least 3 characters")
            .max(25, "Username cannot exceed 25 characters")
            .required(),
    password: 
        yup.string()
            .min(8, "Password must be at least 8 characters")
            .required(),
    confirmPassword: 
        yup.string()
            .oneOf([yup.ref("password"), null], "Passwords do not match")
            .required(),
});

function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInput>({
        resolver: yupResolver(signupSchema),
    });

    const loginStatus = useAppSelector(selectAuthStatus);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onSubmit = async (data: SignupFormInput) => {
        await dispatch(sendSignupInfoAsync(data))
            .then((response) => {
                // redirect to previous page if login successful
                if (!("error" in response.payload)) {
                    navigate("/");
                }
                return response;
            });
    }

    const loginLink = <Link to="/login">Login</Link>;

    return (<div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-container"
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                <div className="card" style={{ margin: "200px", width: "500px" }}>
                    <div className="card-body text-start">
                        <h1>Sign up</h1>
                        <div>
                            <label htmlFor="formUsername" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="formUsername"
                                {...register("username")} />
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.username?.message
                                    || (loginStatus == AuthStatuses.DuplicateUsername && AuthStatuses.DuplicateUsername)}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="formPassword" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="formPassword"
                                {...register("password")} />
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.password?.message}
                            </div>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="formConfirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="formConfirmPassword"
                                {...register("confirmPassword")} />
                            <div className="form-text text-danger" style={{ height: "21px" }}>
                                {errors.confirmPassword?.message}
                            </div>
                        </div>2
                        <div className="mb-3">
                            <input
                                type="submit"
                                className="btn btn-primary btn-lg form-control"
                                value="Register" />
                        </div>
                        <div className="mt-4 d-flex justify-content-center">
                            <p>Already have an account? {loginLink} now.</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>);
}

export default SignupForm