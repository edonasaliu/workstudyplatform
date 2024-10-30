// src/views/admin/AdminDashboard.js

import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <Container className="my-5 text-center">
            <h1>Admin Dashboard</h1>
            <p className="text-muted">Manage job postings and view WA Position Tracker.</p>
            <Row className="justify-content-center mt-4">
                <Col md={4}>
                    <Button variant="primary" onClick={() => navigate('/admin/job-posting-dashboard')} block>
                        Job Posting Dashboard
                    </Button>
                </Col>
                <Col md={4}>
                    <Button variant="secondary" onClick={() => navigate('/admin/wa-position-tracker')} block>
                        WA Position Tracker
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
