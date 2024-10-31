import React, { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';

const NavbarComponent = () => {
    const { user, logout } = useContext(UserContext);
    const [canReadEmployerDashboard, setCanReadEmployerDashboard] = useState(false);
    const [canReadStudentDashboard, setCanReadStudentDashboard] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);  

    const [hoverItem, setHoverItem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const ability = defineAbilityFor(user);
            setCanReadEmployerDashboard(ability.can('read', 'employer-dashboard'));
            setCanReadStudentDashboard(ability.can('read', 'student-dashboard'));
            setIsAdmin(user.role === 'admin');  
        } else {
            setCanReadEmployerDashboard(false);
            setCanReadStudentDashboard(false);
            setIsAdmin(false);
        }
    }, [user]);

    const handleMouseEnter = (itemName) => setHoverItem(itemName);
    const handleMouseLeave = () => setHoverItem('');
    
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinkStyle = (itemName) => ({
        color: hoverItem === itemName ? '#f45d26' : 'white',
        marginRight: '10px',
    });

    const lastNavLinkStyle = (itemName) => ({
        color: hoverItem === itemName ? '#f45d26' : 'white',
    });

    return (
        <Navbar bg="black" expand="lg" className="py-3" variant="dark" style={{ backgroundColor: 'black' }}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {!user && (<Nav.Link as={NavLink} to="/">Home</Nav.Link>)}
                    
                    {isAdmin ? (
                        // Show only for admin users
                        <>
                        <Nav.Link as={NavLink} to="/admin/job-posting-dashboard">Job Postings</Nav.Link>
                        <Nav.Link as={NavLink} to="/admin/wa-position-tracker">WA Position Tracker</Nav.Link>
                        <Nav.Link as={NavLink} to="/admin/teams">Teams</Nav.Link>
                        </>

                    ) : (
                        // Show student or employer dashboards based on permissions
                        <>
                            {canReadStudentDashboard && (<Nav.Link as={NavLink} to="/Dashboard">Dashboard</Nav.Link>)}
                            {canReadStudentDashboard && (<Nav.Link as={NavLink} to="/find-job">Find Job</Nav.Link>)}
                            {canReadEmployerDashboard && (<Nav.Link as={NavLink} to="/employer-dashboard">Employer Dashboard</Nav.Link>)}
                            {canReadEmployerDashboard && (
                                <Nav.Link as={NavLink} to="/employers">Post a Job</Nav.Link>
                            )}
                        </>
                    )}
                </Nav>

                <Nav className="ms-auto" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                    {!user ? (
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
