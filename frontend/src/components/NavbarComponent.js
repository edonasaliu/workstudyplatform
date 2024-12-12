import React, { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';
import { FaHome, FaBriefcase, FaSearch, FaUsers, FaSignOutAlt, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const NavbarComponent = () => {
    const { user, logout } = useContext(UserContext);
    const [canReadEmployerDashboard, setCanReadEmployerDashboard] = useState(false);
    const [canReadStudentDashboard, setCanReadStudentDashboard] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
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

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const styles = {
        navbar: {
            backgroundColor: 'black',
            padding: '1rem 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        navLink: {
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            margin: '0 0.25rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            '&:hover': {
                color: '#f45d26',
                backgroundColor: 'rgba(244, 93, 38, 0.1)',
            },
        },
        activeLink: {
            color: '#f45d26',
            backgroundColor: 'rgba(244, 93, 38, 0.1)',
        },
        logo: {
            height: '35px',
            marginRight: '2rem',
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
        }
    };

    return (
        <Navbar expand="lg" style={styles.navbar} variant="dark" fixed="top">
            <Container>
                {/* Logo */}
                <Navbar.Brand as={NavLink} to="/">
                    <img
                        src="https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg"
                        alt="Minerva Logo"
                        style={styles.logo}
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Home Link */}
                        {!user && (
                            <Nav.Link as={NavLink} to="/" style={styles.navLink}>
                                <FaHome /> Home
                            </Nav.Link>
                        )}
                        
                        {/* Admin Navigation */}
                        {isAdmin && (
                            <>
                                <Nav.Link as={NavLink} to="/admin/job-posting-dashboard" style={styles.navLink}>
                                    <FaBriefcase /> Job Postings
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/ws-position-tracker" style={styles.navLink}>
                                    <FaSearch /> Position Tracker
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/teams" style={styles.navLink}>
                                    <FaUsers /> Teams
                                </Nav.Link>
                            </>
                        )}

                        {/* Student Navigation */}
                        {!isAdmin && canReadStudentDashboard && (
                            <>
                                <Nav.Link as={NavLink} to="/Dashboard" style={styles.navLink}>
                                    <FaUsers /> Dashboard
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/find-job" style={styles.navLink}>
                                    <FaSearch /> Find Job
                                </Nav.Link>
                            </>
                        )}

                        {/* Employer Navigation */}
                        {!isAdmin && canReadEmployerDashboard && (
                            <>
                                <Nav.Link as={NavLink} to="/employer-dashboard" style={styles.navLink}>
                                    <FaUsers /> Dashboard
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/employers" style={styles.navLink}>
                                    <FaBriefcase /> Post a Job
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    {/* Authentication Buttons */}
                    <Nav>
                        {!user ? (
                            <div className="d-flex gap-2">
                                <Button
                                    as={NavLink}
                                    to="/login"
                                    variant="outline-light"
                                    style={styles.button}
                                >
                                    <FaSignInAlt /> Login
                                </Button>
                                <Button
                                    as={NavLink}
                                    to="/register"
                                    style={{
                                        ...styles.button,
                                        backgroundColor: '#f45d26',
                                        borderColor: '#f45d26',
                                    }}
                                >
                                    <FaUserPlus /> Register
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline-light"
                                onClick={handleLogout}
                                style={styles.button}
                            >
                                <FaSignOutAlt /> Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;