import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FooterComponent = () => {
    const { user } = useContext(UserContext);
    const [canReadEmployerDashboard, setCanReadEmployerDashboard] = useState(false);
    const [canReadStudentDashboard, setCanReadStudentDashboard] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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

    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="footer"
            style={{
                backgroundColor: 'black',
                color: 'white',
                width: '100%', // Stretch to full width
                padding: '0', // Remove default padding
            }}
        >
            <Container fluid style={{ maxWidth: '100%', padding: '0 2rem' }}>
                <Row className="py-4">
                    {/* Logo and Address Section */}
                    <Col md={3} className="mb-3">
                        <Image 
                            src="https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg" 
                            alt="Minerva Logo" 
                            fluid 
                        />
                        <div style={{ paddingTop: '20px' }}>
                            <address>
                                14 Mint Plaza<br />
                                Suite 300<br />
                                San Francisco, CA 94103
                            </address>
                        </div>
                    </Col>

                    {/* Admin Section - Conditionally displayed for admins only */}
                    {isAdmin && (
                        <Col md={3} className="mb-3">
                            <h5>Admin</h5>
                            <ul className="list-unstyled">
                                <li><NavLink to="/admin">Main Dashboard</NavLink></li>
                                <li><NavLink to="/admin/job-posting-dashboard">Job Postings Dashboard</NavLink></li>
                                <li><NavLink to="/admin/ws-position-tracker">WS Position Tracker</NavLink></li>
                                <li><NavLink to="/admin/teams">Teams Overview Dashboard</NavLink></li>
                            </ul>
                        </Col>
                    )}

                    {/* Student Links - Conditionally displayed for students */}
                    {!isAdmin && canReadStudentDashboard && (
                        <Col md={2} className="mb-3">
                            <h5>Students</h5>
                            <ul className="list-unstyled">
                                <li><NavLink to="/find-job">Find a Job</NavLink></li>
                                <li><NavLink to="/Dashboard">Dashboard</NavLink></li>
                            </ul>
                        </Col>
                    )}

                    {/* Manager Links - Conditionally displayed for managers */}
                    {!isAdmin && canReadEmployerDashboard && (
                        <Col md={2} className="mb-3">
                            <h5>Managers</h5>
                            <ul className="list-unstyled">
                                <li><NavLink to="/employers">Post a Job</NavLink></li>
                                <li><NavLink to="/employer-dashboard">Dashboard</NavLink></li>
                            </ul>
                        </Col>
                    )}

                    {/* Support Links */}
                    <Col md={2} className="mb-3">
                        <h5>Support</h5>
                        <ul className="list-unstyled">
                            <li><a href="https://www.minerva.edu/privacy/" style={{ color: 'white' }}>Privacy Policy</a></li>
                            <li><a href="https://www.minerva.edu/terms/" style={{ color: 'white' }}>Terms & Conditions</a></li>
                        </ul>
                    </Col>

                    {/* Social Media Icons */}
                    <Col md={2} className="text-md-right mb-3">
                        <a href="https://www.facebook.com/MinervaUniversityGlobal/" className="text-white mx-2"><FaFacebook size={24} /></a>
                        <a href="https://www.youtube.com/c/MinervaUni" className="text-white mx-2"><FaYoutube size={24} /></a>
                        <a href="https://www.instagram.com/minervauniversity/" className="text-white mx-2"><FaInstagram size={24} /></a>
                        <a href="https://www.linkedin.com/school/minerva-university/" className="text-white mx-2"><FaLinkedin size={24} /></a>
                    </Col>
                </Row>

                {/* Footer Bottom Section */}
                <Row className="border-top pt-3 mt-3">
                    <Col md={6} className="mb-3">
                        ©{currentYear} Minerva University, Inc. All Rights Reserved.
                    </Col>
                    <Col md={6} className="text-md-right mb-3">
                        <p className="mb-0"><small>This is an ongoing project created by Edona Saliu. To recommend a feature, report a bug, or give feedback, email <a href="mailto:edonasaliu@uni.minerva.edu" style={{ color: 'white' }}>edonasaliu@uni.minerva.edu</a></small></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterComponent;
