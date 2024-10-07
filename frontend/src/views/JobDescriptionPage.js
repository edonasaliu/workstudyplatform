import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * Displays detailed information about a specific job.
 * 
 * @param {Object} jobData - Data of the job to display.
 * @returns {JSX.Element} The JobDescriptionPage component.
 */
const JobDescriptionPage = ({ jobData }) => {
    const navigate = useNavigate();

    /**
     * Returns a string of hiring semesters or a default message if not specified.
     */
    const getSelectedSemesters = () => {
        return jobData.hiring_semesters.join(', ') || 'Not specified';
    };

    /**
     * Navigates to the employer dashboard.
     */
    const navigateToEmployerDashboard = () => {
        navigate('/employer-dashboard');
    };


    return (
        <Container className="my-5">
            <Row className="text-center mb-4">
                <Col>
                    <h1>{jobData.title || 'Not specified'}</h1>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Department:</strong> {jobData.department || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Manager Name:</strong> {jobData.manager_name || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Manager Email:</strong> {jobData.manager_email || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Hiring Semesters:</strong> {getSelectedSemesters()}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Minimum Number of Students:</strong> {jobData.min_students || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Maximum Number of Students:</strong> {jobData.max_students || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Role Location:</strong> {jobData.role_location || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Type of Work:</strong> {jobData.type_of_work || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Prerequisites:</strong> {jobData.prerequisites || 'None'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>Brief Job Description:</strong> {jobData.brief_description || 'Not provided'}</Col>
            </Row>
            <Row className="mb-3">
                <Col><strong>More Details:</strong> {jobData.more_details || 'Not provided'}</Col>
            </Row>
            <Row className="mb-5">
                <Col><strong>Application Deadline:</strong> {jobData.application_deadline || 'Not specified'}</Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    {/* Button to navigate to the employer dashboard */}
                    <Button onClick={navigateToEmployerDashboard} variant="primary" style={{backgroundColor: '#f45d26', borderColor: '#f45d26', color: 'white'}}>
                        Go to Dashboard
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default JobDescriptionPage;