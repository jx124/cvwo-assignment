import React from 'react'
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { AuthStatuses, selectAuthStatus } from '../auth/authSlice';

function NavigationBar() {
    const authStatus = useAppSelector(selectAuthStatus);
    let loginLogoutLink = null;

    let location = useLocation();

    if (authStatus !== AuthStatuses.LoggedIn) {
        loginLogoutLink =
            <NavLink
                active={location.pathname === "/login"}
                eventKey="2"
                as={Link}
                to="/login">Login</NavLink>;
    } else {
        loginLogoutLink =
            <NavLink 
                active={location.pathname === "/logout"}
                eventKey="3"
                as={Link}
                to="/logout">Logout</NavLink>
    }

    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed='top'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll' />
            <Navbar.Collapse id='navbarScroll'>
                <Nav style={{ marginLeft: "10px" }}>
                    <NavLink 
                        active={location.pathname === "/"}
                        eventKey="1"
                        as={Link}
                        to="/" >Home</NavLink>
                    {loginLogoutLink}
                    <NavLink 
                        active={location.pathname === "/posts/new"}
                        eventKey="4"
                        as={Link}
                        to="/posts/new">Create Post</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar