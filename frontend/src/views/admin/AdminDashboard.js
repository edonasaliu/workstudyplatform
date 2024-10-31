// src/views/admin/AdminDashboard.js

import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Admin Dashboard</h1>
            <p className="text-center mb-4 text-muted">Manage work-study teams, job postings, and track positions.</p>

            <Row className="justify-content-center">
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Teams Overview</Card.Title>
                            <Card.Text>Manage teams, managers, and team-specific information.</Card.Text>
                            <Button
                                style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}
                                onClick={() => navigate('/admin/teams')}
                            >
                                Go to Teams
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Job Postings</Card.Title>
                            <Card.Text>View all work-study job postings and manage applications.</Card.Text>
                            <Button
                                style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}
                                onClick={() => navigate('/admin/job-postings')}
                            >
                                Go to Job Postings
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>WS Tracker Position</Card.Title>
                            <Card.Text>Upload and manage work-study position trackers.</Card.Text>
                            <Button
                                style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}
                                onClick={() => navigate('/admin/ws-tracker')}
                            >
                                Go to Tracker
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
