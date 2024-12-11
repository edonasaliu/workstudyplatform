import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaExclamationCircle, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

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
  statsCard: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    textAlign: "center",
    padding: "1.5rem",
  },
  applicationCard: {
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1rem",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
};

/**
 * Student Dashboard Component
 * Displays student's job applications and their current status
 * 
 * @param {Object} props - Component props
 * @param {string} props.userName - Name of the student
 */
const Dashboard = ({ userName }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application statistics
  const stats = {
    total: appliedJobs.length,
    pending: appliedJobs.filter(job => job.status === 'pending').length,
    accepted: appliedJobs.filter(job => job.status === 'accepted').length,
  };

  /**
   * Fetches user's job applications
   */
  useEffect(() => {
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
          alert('Failed to load your applications. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('Error loading applications. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  /**
   * Handles application withdrawal
   * @param {string} jobId - ID of the job to withdraw from
   */
  const handleWithdraw = async (jobId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

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
        throw new Error('Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to withdraw application. Please try again.');
    }
  };

  /**
   * Returns appropriate badge color based on application status
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'success',
      rejected: 'danger',
      withdrawn: 'secondary'
    };
    return colors[status] || 'info';
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Welcome, {userName || 'Student'}!
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Track your work-study applications and their status
          </p>
        </Card.Body>
      </Card>

      {/* Stats Section */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={styles.statsCard}>
            <FaCheckCircle className="mb-2" style={{ fontSize: '2rem', color: '#f45d26' }} />
            <h3>{stats.total}</h3>
            <p className="text-muted mb-0">Total Applications</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.statsCard}>
            <FaClock className="mb-2" style={{ fontSize: '2rem', color: '#ffc107' }} />
            <h3>{stats.pending}</h3>
            <p className="text-muted mb-0">Pending Review</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.statsCard}>
            <FaExclamationCircle className="mb-2" style={{ fontSize: '2rem', color: '#28a745' }} />
            <h3>{stats.accepted}</h3>
            <p className="text-muted mb-0">Accepted</p>
          </Card>
        </Col>
      </Row>

      {/* Applications Section */}
      <div className="mb-4">
        <h2 style={{ 
          color: "#2c3e50",
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1.5rem"
        }}>
          Your Applications
        </h2>

        {loading ? (
          <Card style={styles.applicationCard}>
            <Card.Body className="text-center py-5">
              <p className="mb-0">Loading your applications...</p>
            </Card.Body>
          </Card>
        ) : appliedJobs.length > 0 ? (
          appliedJobs.map(job => (
            <Card key={job.id} style={styles.applicationCard}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={9}>
                    <div className="d-flex align-items-center mb-2">
                      <h4 className="mb-0">{job.job.title}</h4>
                      <Badge 
                        bg={getStatusColor(job.status)}
                        className="ms-2"
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-muted mb-2">
                      {job.job.department} • {job.job.location}
                    </p>
                    <div className="d-flex gap-4 mb-2">
                      <div>
                        <small className="text-muted d-block">Semesters</small>
                        <strong>{job.job.hiring_semesters}</strong>
                      </div>
                      <div>
                        <small className="text-muted d-block">Deadline</small>
                        <strong>{job.job.application_deadline}</strong>
                      </div>
                    </div>
                    <p className="mb-0">
                      {job.job.description}
                    </p>
                  </Col>
                  <Col md={3} className="text-end">
                    {job.status === 'pending' && (
                      <Button
                        variant="outline-danger"
                        onClick={() => handleWithdraw(job.id)}
                        className="d-flex align-items-center gap-2 ms-auto"
                      >
                        <FaTimes /> Withdraw
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card style={styles.applicationCard}>
            <Card.Body className="text-center py-5">
              <p className="text-muted mb-0">You haven't applied to any positions yet.</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;