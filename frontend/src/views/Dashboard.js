import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

/**
 * Dashboard component displays the jobs applied by the user.
 * Allows users to view their applied jobs and withdraw applications.
 * 
 * @param {string} userName - Name of the user.
 * @returns {JSX.Element} The Dashboard component.
 */
const Dashboard = ({ userName }) => {
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Fetch applied jobs on component mount
    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    /**
     * Fetches jobs applied by the user from the server.
     */
    const fetchAppliedJobs = async () => {
        try {
            const response = await fetch('http://localhost:8080/user-applications', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }); 
            if (response.ok) {
                const jobs = await response.json();
                setAppliedJobs(jobs);
            } else {
                console.error('Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    /**
     * Handles the withdrawal of an application for a job.
     * 
     * @param {string} jobId - The ID of the job for which the application is to be withdrawn.
     */
    const handleWithdraw = async (jobId) => {
        if (window.confirm("Are you sure you want to withdraw your application for this job?")) {
            try {
                const response = await fetch(`http://localhost:8080/user-applications/${jobId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setAppliedJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
                } else {
                    console.error('Failed to withdraw application');
                }
            } catch (error) {
                console.error('Error withdrawing application:', error);
            }
        }
    };

    return (
        <Container className="my-4">
            <h1 className="text-center mb-4">Welcome {userName ? userName : 'User'}!</h1>
            <Row>
                <Col>
                    <h2 className="mb-3">Applied Jobs</h2>
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map(job => (
                            <Card key={job.id} className="mb-3">
                                <Card.Body>
                                    <Row className="justify-content-between">
                                        <Col>
                                            <Card.Title>{job.job.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{job.job.department}</Card.Subtitle>
                                            <Card.Text>
                                                Location: {job.job.location}
                                                <br />
                                                Hiring Semesters: {job.job.hiring_semesters}
                                                <br />
                                                {job.job.description}
                                                <br />
                                                Deadline: {job.job.application_deadline}
                                            </Card.Text>
                                        </Col>
                                        <Col xs="auto">
                                            <Button 
                                                onClick={() => handleWithdraw(job.id)} 
                                                style={{ backgroundColor: '#F45d26', borderColor: 'transparent' }}
                                            >
                                                Withdraw Application
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No applied jobs yet.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
