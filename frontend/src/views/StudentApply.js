import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, FormGroup, FormControl, FormLabel, Row, Col } from 'react-bootstrap';

function StudentApply() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const jobId = location.state?.jobId; // Retrieve job ID from the location state

    // Define emailPattern for validating email addresses
    const emailPattern = "^[a-zA-Z0-9._%+-]+@uni\\.minerva\\.edu$";

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(() => {
                navigate('/Dashboard');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showConfirmation, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('jobId', jobId); // Include jobId
    
        // Send POST request to Flask server
        fetch('http://localhost:8080/apply', {
            method: 'POST',
            body: formData, // Send formData directly
            credentials: 'include',            
        })
        .then(response => response.json())
        .then(data => {
            setShowConfirmation(true);
            console.log('Application submitted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    return (
        <Container className="mt-5">
            {!showConfirmation && (
                <p className="text-center fst-italic mb-4">
                    Welcome to the student application form for Minerva Work-Study positions. Please understand that the submission of this form does not in any way guarantee that you will be selected for a position. You may be assigned a work-study position you do not indicate in this form.
                </p>
            )}
            {!showConfirmation ? (
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <FormGroup as={Col} md="6" controlId="applicantEmail">
                            <FormLabel>Email Address*</FormLabel>
                            <FormControl 
                                type="email" 
                                name="emailAddress" 
                                placeholder="Enter your Email Address" 
                                required 
                                pattern={emailPattern}
                                title="Email address must end with @uni.minerva.edu"
                            />
                        </FormGroup>

                        <FormGroup as={Col} md="6" controlId="yearOfGraduation">
                            <FormLabel>Year of Graduation*</FormLabel>
                            <FormControl type="number" name="yearOfGraduation" placeholder="Enter your Graduation Year" required />
                        </FormGroup>
                    </Row>

                    <FormGroup controlId="uploadResume" className="mb-3">
                        <FormLabel>Upload Resume (optional)</FormLabel>
                        <FormControl type="file" name="resume" accept=".pdf" />
                    </FormGroup>

                    <FormGroup controlId="candidateStatement" className="mb-3">
                        <FormLabel>Why You're a Good Candidate*</FormLabel>
                        <FormControl as="textarea" rows={3} name="candidateStatement" placeholder="2-3 sentences on why you believe you're a good candidate for this position." required />
                    </FormGroup>

                    <Row className="d-flex justify-content-between mb-5">
                        <Col xs={12} md={6} className="d-grid mb-3 mb-md-0">
                            <Button variant="outline-secondary" type="reset">Reset</Button>
                        </Col>
                        <Col xs={12} md={6} className="d-grid">
                            <Button style={{ backgroundColor: '#f45d26', borderColor: '#f45d26' }} type="submit">Submit</Button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="text-center">
                        <h3>Application Submitted Successfully!</h3>
                        <p>Your application has been received. Redirecting to your dashboard...</p>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default StudentApply;
