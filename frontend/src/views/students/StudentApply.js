import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaUpload, FaSave, FaUndo, FaCheckCircle } from 'react-icons/fa';

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
  formCard: {
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    padding: "2rem",
  },
  sectionTitle: {
    color: "#2c3e50",
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #f45d26",
  },
};

/**
 * Student Application Form Component
 * Allows students to apply for work-study positions
 * 
 * @component
 */
function StudentApply() {
  // State management
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;

  // Email validation pattern for Minerva email addresses
  const emailPattern = "^[a-zA-Z0-9._%+-]+@uni\\.minerva\\.edu$";

  // Handle redirect after successful submission
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        navigate('/Dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation, navigate]);

  /**
   * Handles form submission
   * @param {Event} event - Form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    formData.append('jobId', jobId);

    try {
      const response = await fetch('http://localhost:8080/apply', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Application submission failed');
      }

      const data = await response.json();
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles file selection for resume upload
   * @param {Event} event - File input change event
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (showConfirmation) {
    return (
      <div style={styles.container}>
        <Card style={styles.header} className="text-center">
          <Card.Body>
            <FaCheckCircle style={{ fontSize: '3rem', color: '#28a745', marginBottom: '1rem' }} />
            <h2>Application Submitted Successfully!</h2>
            <p className="text-muted">
              Your application has been received. Redirecting to your dashboard...
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Work Study Application
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Please note that submission does not guarantee selection, and you may be assigned to a different position.
          </p>
        </Card.Body>
      </Card>

      {/* Application Form */}
      <Card style={styles.formCard}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <h2 style={styles.sectionTitle}>Basic Information</h2>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="applicantEmail">
                  <Form.Label>Minerva Email Address<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="emailAddress"
                    placeholder="your.name@uni.minerva.edu"
                    required
                    pattern={emailPattern}
                    title="Please use your Minerva email address"
                  />
                  <Form.Text className="text-muted">
                    Use your @uni.minerva.edu email address
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="yearOfGraduation">
                  <Form.Label>Expected Graduation Year<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="yearOfGraduation"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 4}
                    placeholder="YYYY"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Documents */}
            <h2 style={styles.sectionTitle}>Documents</h2>
            <Form.Group controlId="uploadResume" className="mb-4">
              <Form.Label>Resume</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  style={{ cursor: 'pointer' }}
                >
                  <FaUpload /> Upload Resume (PDF)
                </label>
                {selectedFile && (
                  <span className="ms-3 text-muted">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              <Form.Text className="text-muted">
                Optional: Upload your resume in PDF format
              </Form.Text>
            </Form.Group>

            {/* Statement */}
            <h2 style={styles.sectionTitle}>Candidate Statement</h2>
            <Form.Group controlId="candidateStatement" className="mb-4">
              <Form.Label>Why are you a good candidate?<span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="candidateStatement"
                placeholder="Share why you would be a great fit for this position (2-3 sentences)"
                required
              />
              <Form.Text className="text-muted">
                Briefly describe your relevant skills and experience
              </Form.Text>
            </Form.Group>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="light"
                type="reset"
                className="d-flex align-items-center gap-2"
                disabled={loading}
              >
                <FaUndo /> Reset
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#f45d26',
                  borderColor: '#f45d26',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaSave /> {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default StudentApply;