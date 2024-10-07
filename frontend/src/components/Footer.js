
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from '../contexts/UserContext';
import { defineAbilityFor } from '../ability';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaFacebook, FaYoutube, FaInstagram, FaLinkedin } from 'react-icons/fa';

// FooterComponent defines the footer for the application
const FooterComponent = () => {
    const { user } = useContext(UserContext);
    const [canReadEmployerDashboard, setCanReadEmployerDashboard] = useState(false);
    const [canReadStudentDashboard, setCanReadStudentDashboard] = useState(false);
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
    // Get the current year to dynamically display in the copyright notice
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer" style={{ backgroundColor: 'black', color: 'white' }}>
            <Container>
                {/* The content of the footer is organized in rows and columns */}
                <Row className="py-4">
                    {/* The first column contains the logo and address */}
                    <Col md={3} className="mb-3">
                        <Image 
                            src="https://assets-global.website-files.com/64ca995f0fd30a33b2fd01cc/64ca995f0fd30a33b2fd03e4_minerva.svg" 
                            alt="Minerva Logo" 
                            fluid // Image scales with the width of the column
                        />
                        <div style={{ paddingTop: '20px' }}>
                            <address>
                                14 Mint Plaza<br />
                                Suite 300<br />
                                San Francisco, CA 94103
                            </address>
                        </div>
                    </Col>
                    {/* The second column provides quick links for students */}
                    {canReadStudentDashboard && (<Col md={2} className="mb-3">
                        <h5>Students</h5>
                        <ul className="list-unstyled">
                            <li><Nav.Link as={NavLink} to="/find-job">Find a Job</Nav.Link></li>
                            <li><Nav.Link as={NavLink} to="/Dashboard">Dashboard</Nav.Link></li>
                        </ul>
                    </Col>)}
                    {/* The third column provides quick links for managers */}
                    {canReadEmployerDashboard && (<Col md={2} className="mb-3">
                        <h5>Managers</h5>
                        <ul className="list-unstyled">
                            <li><Nav.Link as={NavLink} to="/employers">Post a Job</Nav.Link></li>
                            <li><Nav.Link as={NavLink} to="/employer-dashboard">Dashboard</Nav.Link></li>
                        </ul>
                    </Col>)}
                    {/* The fourth column provides support links */}
                    <Col md={2} className="mb-3">
                        <h5>Support</h5>
                        <ul className="list-unstyled">
                            <li><a href="https://www.minerva.edu/privacy/" style={{ color: 'white' }}>Privacy Policy</a></li>
                            <li><a href="https://www.minerva.edu/terms/" style={{ color: 'white' }}>Terms & Conditions</a></li>
                        </ul>
                    </Col>
                    {/* The fifth column contains social media icons */}
                    <Col md={3} className="text-md-right mb-3">
                        <a href="https://www.facebook.com/MinervaUniversityGlobal/" className="text-white mx-2"><FaFacebook size={24} /></a>
                        <a href="https://www.youtube.com/c/MinervaUni" className="text-white mx-2"><FaYoutube size={24} /></a>
                        <a href="https://www.instagram.com/minervauniversity/" className="text-white mx-2"><FaInstagram size={24} /></a>
                        <a href="https://www.linkedin.com/school/minerva-university/" className="text-white mx-2"><FaLinkedin size={24} /></a>
                    </Col>
                </Row>
                {/* Bottom row with copyright and a message about the ongoing project */}
                <Row className="border-top pt-3 mt-3">
                    <Col md={6} className="mb-3">
                        {/* The dynamic year is now being used in the text */}
                        ©{currentYear} Minerva University, Inc. All Rights Reserved.
                    </Col>
                    <Col md={6} className="text-md-right mb-3">
                        <p className="mb-0"><small>This is an ongoing project created by students. To recommend a feature, report a bug, or give feedback, email <a href="mailto:workstudy@minerva.edu" style={{ color: 'white' }}>workstudy@minerva.edu</a></small></p>
                    </Col>
                </Row>
            </Container>
            {/* Additional div to cover any potential white space below the footer */}
            <div style={{ backgroundColor: 'black', height: '4rem' }}></div>
        </footer>
    );
};

export default FooterComponent;
