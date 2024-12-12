import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

/**
 * Footer component with role-based content and social media links
 * @component
 */
const FooterComponent = () => {
    // Context and state management
    const { user } = useContext(UserContext);
    const [permissions, setPermissions] = useState({
        canReadEmployerDashboard: false,
        canReadStudentDashboard: false,
        isAdmin: false
    });

    // Styles for footer elements
    const styles = {
        footer: {
            backgroundColor: 'black',
            color: 'white',
            padding: '4rem 0 2rem',
            marginTop: 'auto'
        },
        footerSection: {
            marginBottom: '2rem'
        },
        sectionTitle: {
            color: '#f45d26',
            fontWeight: '600',
            marginBottom: '1.2rem'
        },
        link: {
            color: 'white',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: '#f45d26'
            }
        },
        socialIcon: {
            fontSize: '1.5rem',
            marginRight: '1rem',
            transition: 'color 0.3s ease',
            '&:hover': {
                color: '#f45d26'
            }
        },
        address: {
            marginTop: '1rem',
            lineHeight: '1.6'
        }
    };

    // Update permissions when user changes
    useEffect(() => {
        if (user) {
            const ability = defineAbilityFor(user);
            setPermissions({
                canReadEmployerDashboard: ability.can('read', 'employer-dashboard'),
                canReadStudentDashboard: ability.can('read', 'student-dashboard'),
                isAdmin: user.role === 'admin'
            });
        }
    }, [user]);

    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <Container>
                <Row>
                    {/* Minerva Logo and Address */}
                    <Col lg={4} style={styles.footerSection}>
                        <Image
                            src="https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg"
                            alt="Minerva Logo"
                            height="40"
                            className="mb-3"
                        />
                        <div style={styles.address}>
                            <p className="d-flex align-items-center mb-2">
                                <FaMapMarkerAlt className="me-2" />
                                14 Mint Plaza, Suite 300
                                <br />
                                San Francisco, CA 94103
                            </p>
                            <p className="d-flex align-items-center">
                                <FaEnvelope className="me-2" />
                                <a href="mailto:edonasaliu@uni.minerva.edu" style={styles.link}>
                                    edonasaliu@uni.minerva.edu
                                </a>
                            </p>
                        </div>
                    </Col>

                    {/* Quick Links - Conditionally rendered based on role */}
                    <Col lg={4}>
                        <h5 style={styles.sectionTitle}>Quick Links</h5>
                        <Row>
                            {permissions.isAdmin && (
                                <Col md={6}>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <NavLink to="/admin" style={styles.link}>Dashboard</NavLink>
                                        </li>
                                        <li className="mb-2">
                                            <NavLink to="/admin/job-posting-dashboard" style={styles.link}>
                                                Job Postings
                                            </NavLink>
                                        </li>
                                        <li className="mb-2">
                                            <NavLink to="/admin/teams" style={styles.link}>Teams</NavLink>
                                        </li>
                                    </ul>
                                </Col>
                            )}

                            {!permissions.isAdmin && permissions.canReadStudentDashboard && (
                                <Col md={6}>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <NavLink to="/find-job" style={styles.link}>Find Jobs</NavLink>
                                        </li>
                                        <li className="mb-2">
                                            <NavLink to="/Dashboard" style={styles.link}>My Applications</NavLink>
                                        </li>
                                    </ul>
                                </Col>
                            )}

                            {!permissions.isAdmin && permissions.canReadEmployerDashboard && (
                                <Col md={6}>
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <NavLink to="/employers" style={styles.link}>Post Jobs</NavLink>
                                        </li>
                                        <li className="mb-2">
                                            <NavLink to="/employer-dashboard" style={styles.link}>
                                                Manage Postings
                                            </NavLink>
                                        </li>
                                    </ul>
                                </Col>
                            )}
                        </Row>
                    </Col>

                    {/* Social Media and Additional Links */}
                    <Col lg={4}>
                        <h5 style={styles.sectionTitle}>Connect With Us</h5>
                        <div className="mb-4">
                            <a href="https://www.facebook.com/MinervaUniversityGlobal/" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               style={styles.link}>
                                <FaFacebook style={styles.socialIcon} />
                            </a>
                            <a href="https://www.youtube.com/c/MinervaUni" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               style={styles.link}>
                                <FaYoutube style={styles.socialIcon} />
                            </a>
                            <a href="https://www.instagram.com/minervauniversity/" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               style={styles.link}>
                                <FaInstagram style={styles.socialIcon} />
                            </a>
                            <a href="https://www.linkedin.com/school/minerva-university/" 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               style={styles.link}>
                                <FaLinkedin style={styles.socialIcon} />
                            </a>
                        </div>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="https://www.minerva.edu/privacy/" 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   style={styles.link}>
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="https://www.minerva.edu/terms/" 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   style={styles.link}>
                                    Terms & Conditions
                                </a>
                            </li>
                        </ul>
                    </Col>
                </Row>

                {/* Copyright Section */}
                <Row className="mt-4 pt-4 border-top">
                    <Col md={6} className="text-center text-md-start">
                        <small>©{currentYear} Minerva University. All Rights Reserved.</small>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <small>
                            Created by Edona Saliu
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterComponent;