import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

/**
 * Component for the Employer Dashboard.
 * Displays jobs posted by the employer and applications received.
 * 
 * @param {string} employerName - Name of the employer.
 */
const EmployerDashboard = ({ employerName }) => {
  // State for managing the list of jobs posted by the employer
  const [postedJobs, setPostedJobs] = useState([]);
  // State for managing the applications received for the posted jobs
  const [applicationsReceived, setApplicationsReceived] = useState([]);

  // Fetch jobs posted by the employer on component mount
  useEffect(() => {
    fetch('http://localhost:8080/jobs', {
      method: 'GET',
      credentials: 'include',
      contentType: 'application/json',
    })
    .then(response => response.json())
    .then(data => setPostedJobs(data))  // Update the state with fetched data
    .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  // Fetch applications received on component mount
  useEffect(() => {
    fetch('http://localhost:8080/applications', {
      method: 'GET',
      credentials: 'include',
      contentType: 'application/json',
    })
    .then(response => response.json())
    .then(data => setApplicationsReceived(data))  // Update the state with fetched data
    .catch(error => console.error('Error fetching applications:', error));
  }, []);

  /**
   * Handles the deletion of a job.
   * 
   * @param {string} jobId - The ID of the job to be deleted.
   */
  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      fetch(`http://localhost:8080/jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      .then(response => {
        if (response.ok) {
          // Remove the job from the postedJobs state
          setPostedJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        } else {
          console.error('Error deleting the job');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };

  return (
    <Container className="my-3">
      <h1 className="text-center mb-4">Welcome {employerName ? employerName : 'Employer'}!</h1>
  
      <Row>
        <Col>
          <h2 className="text-muted mb-3">Posted Jobs</h2>
          {postedJobs.length > 0 ? (
            postedJobs.map(job => (
              <Card className="mb-3 shadow-sm" key={job.id}>
                <Card.Body>
                  <Row className="justify-content-between">
                    <Col>
                      <Card.Title>Job Title: {job.title}</Card.Title>
                      <Card.Subtitle className="mb-2">Department: {job.department}</Card.Subtitle>
                      <Card.Text>
                        Location: {job.location}
                        <br />
                        Brief Description: {job.brief_description}
                        <br />
                        Hiring Semesters: {job.hiring_semesters}
                        <br />
                        Deadline: {job.application_deadline}
                      </Card.Text>
                    </Col>
                    <Col xs="auto">
                      <Button variant="warning" href={`/edit-job/${job.id}`} className="me-2" style={{ backgroundColor: '#F45d26', borderColor: 'transparent', color: '#fff' }}>
                        Edit
                      </Button>
                      <Button variant="warning" onClick={() => handleDelete(job.id)} style={{ backgroundColor: '#F45d26', borderColor: 'transparent', color: '#fff' }}>
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : <p className="text-muted">No jobs posted yet.</p>}
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="text-muted mb-3">Applications Received</h2>
          {applicationsReceived.length > 0 ? (
            applicationsReceived.map(application => (
              <Card className="mb-3 shadow-sm" key={application.id}>
                <Card.Body>
                  <Card.Title>{application.job_id}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{application.student_name}</Card.Subtitle>
                  <Card.Text>
                    Email: {application.application.email_address}
                    <br />
                    Statement: {application.application.candidate_statement}
                    <br />
                    Status: {application.application.status}
                    <br />
                    Graduation Year: {application.application.year_of_graduation}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : <p className="text-muted">No applications received yet.</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default EmployerDashboard;
