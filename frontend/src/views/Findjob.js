import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Card, Button, Form, Container } from 'react-bootstrap';

/**
 * Represents a component for searching and displaying job listings.
 * Allows users to search for jobs based on keyword, location, and department.
 * @returns {JSX.Element} The QJobSearch component.
 */
const QJobSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('Other');
  const [jobs, setJobs] = useState([]);
  const [openJobId, setOpenJobId] = useState(null);
  const navigate = useNavigate();

  /**
   * Fetches jobs from the server based on user input filters.
   */
  const fetchJobs = async () => {
    const filters = { keyword, location, department };
    try {
      const response = await fetch('http://localhost:8080/job-search', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJobs(data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  /**
   * Handles form submission to trigger job search.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  /**
   * Toggles the visibility of job details.
   * @param {string} jobId - The ID of the job for which details are toggled.
   */
  const toggleJobDetails = (jobId) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
  };

  return (
    <Container className='my-5'>
      <Form onSubmit={handleSubmit} className='bg-white shadow p-3 mb-5 bg-body rounded'>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="keyword">Keyword</Form.Label>
          <Form.Control type="text" id="keyword" placeholder='Search by job title, keyword, team, etc...' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="location">Location</Form.Label>
          <Form.Control type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="department">Department</Form.Label>
          <Form.Select id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="Other">Other</option>
            <option value="Admission">Admission</option>
            <option value="Academics">Academics</option>
            <option value="Student Services">Student Services</option>
            <option value="Psych Lab">Psych Lab</option>
            <option value="AI Lab">AI Lab</option>
            <option value="Finance">Finance</option>
            <option value="Ops">Ops</option>
            <option value="Student Life">Student Life</option>
            <option value="Admin">Admin</option>
            <option value="CTD">CTD</option>
            <option value="Advancement">Advancement</option>
            <option value="Enrollment">Enrollment</option>
            <option value="External relations">External relations</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}>Find Job</Button>
      </Form>

      {jobs.map((job) => (
        <Card className='mb-3 shadow-sm' key={job.id}>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>{job.department}</Card.Subtitle>
                <Card.Text>{job.role_location}</Card.Text>
              </div>
              <div className="d-flex flex-row align-items-start">
                <Button
                  variant="warning"
                  onClick={() => toggleJobDetails(job.id)}
                  className="me-2"
                  style={{ backgroundColor: '#f45d26', borderColor: 'transparent', color: '#fff' }}
                >
                  {openJobId === job.id ? 'Hide Details' : 'View Details'}
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate('/apply', { state: { jobId: job.id } })}
                  style={{ backgroundColor: '#f45d26', borderColor: 'transparent', color: '#fff' }}
                >
                  Apply
                </Button>
              </div>
            </div>

            <Collapse in={openJobId === job.id}>
              <div className="mt-3">
                <p>{job.type}</p>
                <p>{job.hiring_semesters}</p>
                <p>{job.brief_description}</p>
                <p>{job.application_deadline}</p>
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default QJobSearch;
