import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  // Fetch all jobs posted by managers
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/jobs', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  // Open applications modal
  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowApplicationsModal(true);
  };

  // Close applications modal
  const handleCloseModal = () => {
    setShowApplicationsModal(false);
    setSelectedJob(null);
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Admin Dashboard - Job Postings</h1>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card key={job.id} className="mb-3">
            <Card.Body>
              <Row className="justify-content-between">
                <Col>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Department: {job.department}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Posted By:</strong> {job.manager.name} ({job.manager.email}) <br />
                    <strong>Location:</strong> {job.role_location} <br />
                    <strong>Hiring Semesters:</strong> {job.hiring_semesters} <br />
                    <strong>Application Deadline:</strong> {job.application_deadline}
                  </Card.Text>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="primary"
                    onClick={() => handleViewApplications(job)}
                  >
                    View Applications
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-muted">No job postings available.</p>
      )}

      {/* Modal to show applications for a selected job */}
      <Modal show={showApplicationsModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Applications for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob?.applications.length > 0 ? (
            selectedJob.applications.map((application) => (
              <Card key={application.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{application.student_name}</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {application.email_address} <br />
                    <strong>Graduation Year:</strong> {application.year_of_graduation} <br />
                    <strong>Statement:</strong> {application.candidate_statement} <br />
                    <strong>Status:</strong> {application.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No applications for this job.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
