import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AuthStatuses, selectAuthData, selectAuthStatus } from '../auth/authSlice';

/**
 * Navbar component. Contains links to other parts of the website that dynamically shows up 
 * when the user is logged in.
 */
function NavigationBar() {
    const authStatus = useAppSelector(selectAuthStatus);
    const authData = useAppSelector(selectAuthData);
    let loginLogoutLink = null;
    let createPostLink = null;
    let profileLink = null;
    let location = useLocation();

    if (authStatus !== AuthStatuses.LoggedIn) {
        loginLogoutLink =
            <Link className={"nav-link" + (location.pathname === "/login" ? " active" : "")}
                to="/login">Login to Create Post</Link>;
    } else {
        loginLogoutLink =
            <Link className={"nav-link" + (location.pathname === "/logout" ? " active" : "")}
                to="/logout">Logout</Link>;
        createPostLink = 
            <Link className={"nav-link" + (location.pathname === "/posts/new" ? " active" : "")}
                to="/posts/new">Create Post</Link>
        profileLink =
            <Link className={"nav-link" + (location.pathname === "/profile" ? " active" : "")}
                to="/profile">Profile</Link>
    }

    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed='top'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll' />
            <Navbar.Collapse id='navbarScroll'>
                <Nav className='ms-3'>
                    <Link className={"nav-link" + (location.pathname === "/" ? " active" : "")}
                        to="/">Home</Link>
                    {loginLogoutLink}
                    {createPostLink}
                    {profileLink}
                </Nav>
                <div className='nav-link active ms-auto me-4'>
                    <div className='text-light justify-content-center'>
                        {authStatus === AuthStatuses.LoggedIn && "Welcome back, " + authData.user?.username}
                    </div>
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar