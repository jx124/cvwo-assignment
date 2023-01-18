import React from 'react'
import { Container, Nav, Navbar, NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed='top'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target='#navbarScroll' />
            <Navbar.Collapse id='navbarScroll'>
                <Nav style={{marginLeft: "30px"}}>
                    <NavLink eventKey="1" as={Link} to="/" >Home</NavLink>
                    <NavLink eventKey="2" as={Link} to="/login">Login</NavLink>
                    <NavLink eventKey="3" as={Link} to="/posts/new">Create Post</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar