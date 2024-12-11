import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUsers, FaBriefcase, FaCheckCircle, FaClock } from 'react-icons/fa';

// Custom styles matching the application theme
const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    backgroundColor: "#fff5f1",
    borderRadius: "10px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  headerTitle: {
    color: "#2c3e50",
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  statsCard: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    textAlign: "center",
    padding: "1.5rem",
  },
  sectionTitle: {
    color: "#2c3e50",
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
};

/**
 * EmployerDashboard Component
 * Displays jobs posted by the employer and applications received.
 * 
 * @param {Object} props
 * @param {string} props.employerName - Name of the employer
 */
const EmployerDashboard = ({ employerName }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicationsReceived, setApplicationsReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs posted by the employer
  useEffect(() => {
    fetch('http://localhost:8080/jobs', {
      method: 'GET',
      credentials: 'include',
      contentType: 'application/json',
    })
    .then(response => response.json())
    .then(data => {
      setPostedJobs(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    });
  }, []);

  // Fetch applications received
  useEffect(() => {
    fetch('http://localhost:8080/applications', {
      method: 'GET',
      credentials: 'include',
      contentType: 'application/json',
    })
    .then(response => response.json())
    .then(data => {
      setApplicationsReceived(data);
    })
    .catch(error => console.error('Error fetching applications:', error));
  }, []);

  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      fetch(`http://localhost:8080/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      .then(response => {
        if (response.ok) {
          setPostedJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        } else {
          console.error('Error deleting the job');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };

  // Calculate statistics
  const stats = {
    totalJobs: postedJobs.length,
    activeJobs: postedJobs.filter(job => new Date(job.application_deadline) > new Date()).length,
    totalApplications: applicationsReceived.length,
    pendingReview: applicationsReceived.filter(app => app.application?.status === 'pending').length
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={styles.headerTitle}>Welcome {employerName || 'Employer'}!</h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Manage your work-study positions and review applications
          </p>
        </Card.Body>
      </Card>

      {/* Stats Section */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaBriefcase className="mb-2" style={{ fontSize: '2rem', color: '#f45d26' }} />
            <h3>{stats.totalJobs}</h3>
            <p className="text-muted mb-0">Total Positions</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaCheckCircle className="mb-2" style={{ fontSize: '2rem', color: '#2ecc71' }} />
            <h3>{stats.activeJobs}</h3>
            <p className="text-muted mb-0">Active Positions</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaUsers className="mb-2" style={{ fontSize: '2rem', color: '#3498db' }} />
            <h3>{stats.totalApplications}</h3>
            <p className="text-muted mb-0">Total Applications</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaClock className="mb-2" style={{ fontSize: '2rem', color: '#e74c3c' }} />
            <h3>{stats.pendingReview}</h3>
            <p className="text-muted mb-0">Pending Review</p>
          </Card>
        </Col>
      </Row>

      {/* Posted Jobs Section */}
      <div className="mb-4">
        <h2 style={styles.sectionTitle}>
          <FaBriefcase /> Posted Jobs
        </h2>
        {loading ? (
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center py-4">
              <p className="mb-0">Loading...</p>
            </Card.Body>
          </Card>
        ) : postedJobs.length > 0 ? (
          postedJobs.map(job => (
            <Card className="mb-3 shadow-sm" key={job.id}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <div className="d-flex align-items-center mb-2">
                      <Card.Title className="mb-0">{job.title}</Card.Title>
                      <Badge 
                        bg={new Date(job.application_deadline) > new Date() ? 'success' : 'secondary'}
                        className="ms-2"
                      >
                        {new Date(job.application_deadline) > new Date() ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <Card.Subtitle className="mb-2 text-muted">
                      Department: {job.department}
                    </Card.Subtitle>
                    <div className="d-flex gap-4 mb-2">
                      <div>
                        <small className="text-muted">Location</small>
                        <p className="mb-0"><strong>{job.location}</strong></p>
                      </div>
                      <div>
                        <small className="text-muted">Hiring Semesters</small>
                        <p className="mb-0"><strong>{job.hiring_semesters}</strong></p>
                      </div>
                      <div>
                        <small className="text-muted">Deadline</small>
                        <p className="mb-0">
                          <strong>{new Date(job.application_deadline).toLocaleDateString()}</strong>
                        </p>
                      </div>
                    </div>
                    <Card.Text>
                      {job.brief_description}
                    </Card.Text>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="light"
                      href={`/edit-job/${job.id}`}
                      className="me-2"
                      style={{ color: '#f45d26' }}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => handleDelete(job.id)}
                      style={{ color: '#dc3545' }}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center py-4">
              <p className="text-muted mb-0">No jobs posted yet.</p>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Applications Section */}
      <div>
        <h2 style={styles.sectionTitle}>
          <FaUsers /> Applications Received
        </h2>
        {applicationsReceived.length > 0 ? (
          applicationsReceived.map(application => (
            <Card className="mb-3 shadow-sm" key={application.id}>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title>{application.student_name}</Card.Title>
                      <Badge bg={application.application.status === 'pending' ? 'warning' : 'success'}>
                        {application.application.status}
                      </Badge>
                    </div>
                    <Card.Subtitle className="mb-2 text-muted">
                      Job ID: {application.job_id}
                    </Card.Subtitle>
                    <div className="d-flex gap-4 mb-3">
                      <div>
                        <small className="text-muted">Email</small>
                        <p className="mb-0"><strong>{application.application.email_address}</strong></p>
                      </div>
                      <div>
                        <small className="text-muted">Graduation Year</small>
                        <p className="mb-0"><strong>{application.application.year_of_graduation}</strong></p>
                      </div>
                    </div>
                    <Card.Text>
                      <small className="text-muted">Statement:</small>
                      <p className="mb-0">{application.application.candidate_statement}</p>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card className="mb-3 shadow-sm">
            <Card.Body className="text-center py-4">
              <p className="text-muted mb-0">No applications received yet.</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;