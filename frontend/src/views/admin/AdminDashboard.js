import React, { useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBriefcase, 
  FaClipboardList, 
  FaArrowRight,
  FaChartLine
} from 'react-icons/fa';

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
  statsCard: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    textAlign: "center",
    padding: "1.5rem",
  },
  menuCard: {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    padding: "1.5rem",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    },
  },
  icon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#f45d26",
  },
  button: {
    backgroundColor: "#f45d26",
    borderColor: "transparent",
    borderRadius: "8px",
    padding: "0.75rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#e44d20",
      transform: "translateY(-2px)",
    },
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    activeTeams: 12,
    openPositions: 25,
    totalApplications: 156,
    placedStudents: 89,
  });

  const menuItems = [
    {
      title: "Teams Overview",
      description: "Manage teams, department assignments, and track team performance metrics. Monitor manager assignments and team capacity.",
      icon: <FaUsers style={styles.icon} />,
      path: "/admin/teams",
      bgColor: "#fff8f6",
    },
    {
      title: "Job Postings",
      description: "Review work-study positions, manage applications, and oversee the hiring process across all departments.",
      icon: <FaBriefcase style={styles.icon} />,
      path: "/admin/job-posting-dashboard",
      bgColor: "#f6fff8",
    },
    {
      title: "WS Position Tracker",
      description: "Comprehensive tracking system for work-study positions, student assignments, and program compliance.",
      icon: <FaClipboardList style={styles.icon} />,
      path: "/admin/ws-position-tracker",
      bgColor: "#f6f8ff",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
          <p style={styles.headerSubtitle}>
            Centralized management for Minerva's work-study program
          </p>
        </Card.Body>
      </Card>

      {/* Stats Section */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaUsers className="mb-2" style={{ fontSize: "1.5rem", color: "#f45d26" }} />
            <h3>{stats.activeTeams}</h3>
            <p className="text-muted mb-0">Active Teams</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaBriefcase className="mb-2" style={{ fontSize: "1.5rem", color: "#2ecc71" }} />
            <h3>{stats.openPositions}</h3>
            <p className="text-muted mb-0">Open Positions</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaChartLine className="mb-2" style={{ fontSize: "1.5rem", color: "#3498db" }} />
            <h3>{stats.totalApplications}</h3>
            <p className="text-muted mb-0">Total Applications</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={styles.statsCard}>
            <FaUsers className="mb-2" style={{ fontSize: "1.5rem", color: "#9b59b6" }} />
            <h3>{stats.placedStudents}</h3>
            <p className="text-muted mb-0">Placed Students</p>
          </Card>
        </Col>
      </Row>

      {/* Menu Cards */}
      <Row className="mt-4">
        {menuItems.map((item, index) => (
          <Col md={4} key={index}>
            <Card 
              style={{ ...styles.menuCard, backgroundColor: item.bgColor }}
              onClick={() => navigate(item.path)}
            >
              <Card.Body className="text-center">
                {item.icon}
                <Card.Title className="mb-3 fw-bold">{item.title}</Card.Title>
                <Card.Text className="text-muted mb-4">
                  {item.description}
                </Card.Text>
                <Button style={styles.button}>
                  Access {item.title} <FaArrowRight />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;