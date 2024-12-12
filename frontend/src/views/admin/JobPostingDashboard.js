import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Badge, Form } from 'react-bootstrap';
import { FaSearch, FaEye, FaFilter } from 'react-icons/fa';

// Custom styles consistent with other dashboards
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
  headerSubtitle: {
    color: "#666",
    fontSize: "1.1rem",
    margin: 0,
  },
  card: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
  },
  searchBar: {
    position: "relative",
    marginBottom: "1.5rem",
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d",
  },
  jobCard: {
    transition: "transform 0.2s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  statsCard: {
    textAlign: "center",
    padding: "1.5rem",
  },
};

const JobPostingDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activePositions: 0,
  });

  // Stats calculation would go here in real implementation

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowApplicationsModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationsModal(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job =>
    Object.values(job).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={styles.headerTitle}>Job Posting Dashboard</h1>
          <p style={styles.headerSubtitle}>
            Review and manage all work-study positions and applications
          </p>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={{ ...styles.card, ...styles.statsCard }}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Positions</h6>
              <h2>{stats.totalJobs}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ ...styles.card, ...styles.statsCard }}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Applications</h6>
              <h2>{stats.totalApplications}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ ...styles.card, ...styles.statsCard }}>
            <Card.Body>
              <h6 className="text-muted mb-2">Active Positions</h6>
              <h2>{stats.activePositions}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card className="mb-4" style={styles.card}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div style={styles.searchBar}>
                <FaSearch style={styles.searchIcon} />
                <Form.Control
                  type="text"
                  placeholder="Search jobs by title, department, or manager..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "2.5rem", height: "45px", borderRadius: "8px" }}
                />
              </div>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2"
              >
                <FaFilter /> Filter
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Job Listings */}
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Card key={job.id} className="mb-3" style={{ ...styles.card, ...styles.jobCard }}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={9}>
                  <div className="d-flex align-items-center mb-2">
                    <h4 className="mb-0">{job.title}</h4>
                    <Badge 
                      bg="success" 
                      className="ms-2"
                      style={{ padding: "0.5em 1em" }}
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted mb-2">
                    {job.department} • Posted by {job.manager.name}
                  </p>
                  <div className="d-flex gap-3">
                    <div>
                      <small className="text-muted d-block">Location</small>
                      <strong>{job.role_location}</strong>
                    </div>
                    <div>
                      <small className="text-muted d-block">Semesters</small>
                      <strong>{job.hiring_semesters}</strong>
                    </div>
                    <div>
                      <small className="text-muted d-block">Deadline</small>
                      <strong>{job.application_deadline}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={3} className="text-end">
                  <Button
                    variant="primary"
                    onClick={() => handleViewApplications(job)}
                    style={{ 
                      backgroundColor: "#f45d26", 
                      borderColor: "#f45d26",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <FaEye /> View Applications
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card style={styles.card}>
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-0">No job postings found</p>
          </Card.Body>
        </Card>
      )}

      {/* Applications Modal */}
      <Modal 
        show={showApplicationsModal} 
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Applications for {selectedJob?.title}
            {selectedJob && (
              <div className="text-muted fs-6">
                Department: {selectedJob.department}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob?.applications?.length > 0 ? (
            selectedJob.applications.map((application) => (
              <Card key={application.id} className="mb-3" style={styles.card}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">{application.student_name}</h5>
                    <Badge bg={
                      application.status === 'Pending' ? 'warning' :
                      application.status === 'Accepted' ? 'success' :
                      'secondary'
                    }>
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-muted mb-2">
                    {application.email_address} • Class of {application.year_of_graduation}
                  </p>
                  <div className="mt-3">
                    <strong>Statement:</strong>
                    <p className="mb-0 mt-2">{application.candidate_statement}</p>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No applications received yet</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobPostingDashboard;