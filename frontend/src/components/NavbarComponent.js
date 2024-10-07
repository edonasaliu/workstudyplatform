import React, { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';

const NavbarComponent = () => {
    const { user, logout } = useContext(UserContext);
    const [canReadEmployerDashboard, setCanReadEmployerDashboard] = useState(false);
    const [canReadStudentDashboard, setCanReadStudentDashboard] = useState(false);

    // State to track which link is being hovered
    const [hoverItem, setHoverItem] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            const ability = defineAbilityFor(user);
            setCanReadEmployerDashboard(ability.can('read', 'employer-dashboard'));
            setCanReadStudentDashboard(ability.can('read', 'student-dashboard'));
        } else {
            setCanReadEmployerDashboard(false);
            setCanReadStudentDashboard(false);
        }
    }, [user]);

    // const canReadStudentDashboard = ability && ability.can('read', 'student-dashboard');

    // Function to handle mouse entering a nav item
    const handleMouseEnter = (itemName) => {
        setHoverItem(itemName);
    };

    // Function to handle mouse leaving a nav item
    const handleMouseLeave = () => {
        setHoverItem('');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Function to determine the style of nav links, including hover effect
    const navLinkStyle = (itemName) => ({
        color: hoverItem === itemName ? '#f45d26' : 'white',
        marginRight: '10px', // Apply margin to all items except the last one
    });

    // Inline style for last nav item to prevent marginRight
    const lastNavLinkStyle = (itemName) => ({
        color: hoverItem === itemName ? '#f45d26' : 'white',
    });

    return (
        // Navbar with a black background and white text
        <Navbar bg="black" expand="lg" className="py-3" variant="dark" style={{ backgroundColor: 'black' }}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {!user && (<Nav.Link as={NavLink} to="/">Home</Nav.Link>)}
                    {canReadStudentDashboard && (<Nav.Link as={NavLink} to="/Dashboard">Dashboard</Nav.Link>)}
                    {canReadStudentDashboard && (<Nav.Link as={NavLink} to="/find-job">Find Job</Nav.Link>)}
                    {canReadEmployerDashboard && (<Nav.Link as={NavLink} to="/employer-dashboard">Employer Dashboard</Nav.Link>)}
                    {canReadEmployerDashboard && (
                        <Nav.Link as={NavLink} to="/employers">Post a Job</Nav.Link>
                    )}
                </Nav>

                <Nav className="ms-auto" style={{ paddingRight: '15px', paddingLeft: '15px' }}> {/* Padding added to the login/register nav */}
                    {!user ? ( // Check if the user is logged in
                        <>
                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                style={navLinkStyle('login')}
                                onMouseEnter={() => handleMouseEnter('login')}
                                onMouseLeave={handleMouseLeave}
                            >Login</Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/register"
                                style={lastNavLinkStyle('register')}
                                onMouseEnter={() => handleMouseEnter('register')}
                                onMouseLeave={handleMouseLeave}
                            >Register</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link
                                as={Button}
                                onClick={handleLogout}
                                style={navLinkStyle('login')}
                                onMouseEnter={() => handleMouseEnter('Logout')}
                                onMouseLeave={handleMouseLeave}
                            >Logout</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;