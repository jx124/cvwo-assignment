import { Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AuthStatuses, selectAuthStatus } from '../auth/authSlice';

function NavigationBar() {
    const authStatus = useAppSelector(selectAuthStatus);
    let loginLogoutLink = null;
    let location = useLocation();

    if (authStatus !== AuthStatuses.LoggedIn) {
        loginLogoutLink =
            <Link className={"nav-link" + (location.pathname === "/login" ? " active" : "")}
                to="/login">Login</Link>;
    } else {
        loginLogoutLink =
            <Link className={"nav-link" + (location.pathname === "/logout" ? " active" : "")}
                to="/logout">Logout</Link>;
    }

    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed='top'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll' />
            <Navbar.Collapse id='navbarScroll'>
                <Nav style={{ marginLeft: "10px" }}>
                    <Link className={"nav-link" + (location.pathname === "/" ? " active" : "")}
                        to="/">Home</Link>
                    {loginLogoutLink}
                    <Link className={"nav-link" + (location.pathname === "/posts/new" ? " active" : "")}
                        to="/posts/new">Create Post</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar