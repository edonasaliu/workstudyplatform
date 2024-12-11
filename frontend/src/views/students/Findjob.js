import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Card, Button, Form, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';

// Custom styles for consistent theming
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
  searchCard: {
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "2rem",
  },
  jobCard: {
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
 * Student Job Search Component
 * Provides an interface for students to search and apply for work-study positions
 * 
 * @component
 * @returns {JSX.Element} Rendered job search interface
 */
const StudentJobSearch = () => {
  // State management for search filters and results
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('Other');
  const [jobs, setJobs] = useState([]);
  const [openJobId, setOpenJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  /**
   * Fetches filtered job listings from the server
   * @async
   */
  const fetchJobs = async () => {
    setLoading(true);
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
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles search form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  /**
   * Toggles job details visibility
   * @param {string} jobId - ID of the job to toggle
   */
  const toggleJobDetails = (jobId) => {
    setOpenJobId(openJobId === jobId ? null : jobId);
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Work Study Positions
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Find and apply for available work-study opportunities
          </p>
        </Card.Body>
      </Card>

      {/* Search Section */}
      <Card style={styles.searchCard}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaSearch className="me-2" />
                    Search
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by title, keyword, team..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Location
                  </Form.Label>
                  <Form.Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    <option value="Virtual">Virtual</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Seoul">Seoul</option>
                    <option value="Taipei">Taipei</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="London">London</option>
                    <option value="Berlin">Berlin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBriefcase className="me-2" />
                    Department
                  </Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
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
                    <option value="External relations">External Relations</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button
                type="submit"
                style={{
                  backgroundColor: '#f45d26',
                  borderColor: 'transparent',
                  padding: '0.5rem 2rem',
                }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Positions'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Section */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Card key={job.id} style={styles.jobCard}>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-2">
                    <h4 className="mb-0">{job.title}</h4>
                    <Badge 
                      bg="info" 
                      className="ms-2"
                    >
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-muted mb-2">
                    {job.department} • {job.role_location}
                  </p>
                  <p className="mb-0">
                    <small>Deadline: {job.application_deadline}</small>
                  </p>
                </Col>
                
                <Col md={4} className="text-end">
                  <Button
                    variant="light"
                    onClick={() => toggleJobDetails(job.id)}
                    className="me-2"
                  >
                    {openJobId === job.id ? (
                      <><FaChevronUp /> Hide Details</>
                    ) : (
                      <><FaChevronDown /> View Details</>
                    )}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: '#f45d26',
                      borderColor: 'transparent',
                    }}
                    onClick={() => navigate('/apply', { state: { jobId: job.id } })}
                  >
                    <FaArrowRight /> Apply
                  </Button>
                </Col>
              </Row>

              <Collapse in={openJobId === job.id}>
                <div className="mt-4">
                  <div className="mb-3">
                    <h5>Job Description</h5>
                    <p>{job.brief_description}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Hiring Semesters</h5>
                    <p>{job.hiring_semesters}</p>
                  </div>
                  
                  {job.prerequisites && (
                    <div>
                      <h5>Prerequisites</h5>
                      <p>{job.prerequisites}</p>
                    </div>
                  )}
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card style={styles.jobCard}>
          <Card.Body className="text-center py-5">
            <p className="mb-0 text-muted">
              {loading ? 'Searching for positions...' : 'No positions found. Try adjusting your search.'}
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default StudentJobSearch;