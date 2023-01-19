import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';

function Logout() {
    const dispatch = useDispatch<AppDispatch>();
    dispatch(logout());

    const homeLink = <Link to="/">home</Link>;

    const navigate = useNavigate();

    function wait(time: number) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        })
    }

    async function redirectHome() {
        await wait(1000);
        navigate("/");
    }

    useEffect(() => {
        redirectHome();
    }, []);

    return (
        <div className='App container'>
            <div className='d-flex justify-content-center' style={{padding: "60px"}}>
                <p>Successfully logged out. Redirecting you to the {homeLink} page...</p>
            </div>
        </div>
    )
}

export default Logout