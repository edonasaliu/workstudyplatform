import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

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

    const footerStyles = {
        footer: {
            backgroundColor: 'black',
            color: 'white',
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            paddingTop: '3rem',
            paddingBottom: '1rem',
        },
        container: {
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
        },
        section: {
            paddingRight: '2rem',
        },
        heading: {
            color: '#f45d26',
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1.2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        link: {
            color: 'white',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
            display: 'inline-block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            '&:hover': {
                color: '#f45d26',
            },
        },
        socialLinks: {
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1rem',
        },
        socialIcon: {
            fontSize: '1.5rem',
            transition: 'color 0.2s ease',
            color: 'white',
            '&:hover': {
                color: '#f45d26',
            },
        },
        divider: {
            borderTop: '1px solid rgba(255,255,255,0.1)',
            margin: '2rem 0 1rem 0',
        },
    };

    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.container}>
                <Row className="justify-content-between">
                    {/* Minerva Logo and Address */}
                    <Col lg={3} md={6} className="mb-4">
                        <Image 
                            src="https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg" 
                            alt="Minerva Logo" 
                            height="35"
                            className="mb-4"
                        />
                        <div className="d-flex align-items-start mb-2">
                            <FaMapMarkerAlt className="mt-1 me-2" />
                            <address style={{ margin: 0, fontSize: '0.9rem' }}>
                                14 Mint Plaza<br />
                                Suite 300<br />
                                San Francisco, CA 94103
                            </address>
                        </div>
                        <div className="d-flex align-items-center">
                            <FaEnvelope className="me-2" />
                            <a href="mailto:edonasaliu@uni.minerva.edu" 
                               style={{ ...footerStyles.link, marginBottom: 0 }}>
                                edonasaliu@uni.minerva.edu
                            </a>
                        </div>
                    </Col>

                    {/* Quick Links Section - Conditionally Rendered */}
                    <Col lg={6} md={12} className="mb-4">
                        <Row>
                            {/* Admin Links */}
                            {isAdmin && (
                                <Col md={6} style={footerStyles.section}>
                                    <h5 style={footerStyles.heading}>Admin</h5>
                                    <ul className="list-unstyled">
                                        <li><NavLink to="/admin" style={footerStyles.link}>Main Dashboard</NavLink></li>
                                        <li><NavLink to="/admin/job-posting-dashboard" style={footerStyles.link}>Job Postings</NavLink></li>
                                        <li><NavLink to="/admin/ws-position-tracker" style={footerStyles.link}>WS Position Tracker</NavLink></li>
                                        <li><NavLink to="/admin/teams" style={footerStyles.link}>Teams Overview</NavLink></li>
                                    </ul>
                                </Col>
                            )}

                            {/* Student Links */}
                            {!isAdmin && canReadStudentDashboard && (
                                <Col md={6} style={footerStyles.section}>
                                    <h5 style={footerStyles.heading}>Students</h5>
                                    <ul className="list-unstyled">
                                        <li><NavLink to="/find-job" style={footerStyles.link}>Find a Job</NavLink></li>
                                        <li><NavLink to="/Dashboard" style={footerStyles.link}>Dashboard</NavLink></li>
                                    </ul>
                                </Col>
                            )}

                            {/* Manager Links */}
                            {!isAdmin && canReadEmployerDashboard && (
                                <Col md={6} style={footerStyles.section}>
                                    <h5 style={footerStyles.heading}>Managers</h5>
                                    <ul className="list-unstyled">
                                        <li><NavLink to="/employers" style={footerStyles.link}>Post a Job</NavLink></li>
                                        <li><NavLink to="/employer-dashboard" style={footerStyles.link}>Dashboard</NavLink></li>
                                    </ul>
                                </Col>
                            )}

                            {/* Support Links */}
                            <Col md={6} style={footerStyles.section}>
                                <h5 style={footerStyles.heading}>Support</h5>
                                <ul className="list-unstyled">
                                    <li><a href="https://www.minerva.edu/privacy/" style={footerStyles.link}>Privacy Policy</a></li>
                                    <li><a href="https://www.minerva.edu/terms/" style={footerStyles.link}>Terms & Conditions</a></li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>

                    {/* Social Links Section */}
                    <Col lg={3} md={6} className="mb-4">
                        <h5 style={footerStyles.heading}>Connect With Us</h5>
                        <div style={footerStyles.socialLinks}>
                            <a href="https://www.facebook.com/MinervaUniversityGlobal/" 
                               target="_blank" 
                               rel="noopener noreferrer">
                                <FaFacebook style={footerStyles.socialIcon} />
                            </a>
                            <a href="https://www.youtube.com/c/MinervaUni" 
                               target="_blank" 
                               rel="noopener noreferrer">
                                <FaYoutube style={footerStyles.socialIcon} />
                            </a>
                            <a href="https://www.instagram.com/minervauniversity/" 
                               target="_blank" 
                               rel="noopener noreferrer">
                                <FaInstagram style={footerStyles.socialIcon} />
                            </a>
                            <a href="https://www.linkedin.com/school/minerva-university/" 
                               target="_blank" 
                               rel="noopener noreferrer">
                                <FaLinkedin style={footerStyles.socialIcon} />
                            </a>
                        </div>
                    </Col>
                </Row>

                {/* Footer Bottom Section */}
                <div style={footerStyles.divider}></div>
                <Row>
                    <Col md={6} className="mb-2 mb-md-0">
                        <small style={{ color: 'rgba(255,255,255,0.7)' }}>
                            ©{currentYear} Minerva University, Inc. All Rights Reserved.
                        </small>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <small style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Created by Edona Saliu
                        </small>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default FooterComponent;